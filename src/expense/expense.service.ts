import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import { Request } from 'src/requests/request.schema';
import { Project } from 'src/projects/project.schema';
import * as dayjs from 'dayjs';
import { ExpenseFiltersDto } from './dtos/expenseFilter.dto';

@Injectable()
export class ExpenseService {
  private s3: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME || '';
  private bucketRegion = process.env.AWS_REGION || '';
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    this.s3 = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async createExpense(createExpenseDto: CreateExpenseDto, file: Express.Multer.File) {
    let fileKey = '';

    try {
      if (file) {
        fileKey = `receipts/${crypto.randomUUID()}-${file.originalname}`;

        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
      }

      // 1. Calcula o valor quando o tipo é combustível
      if (createExpenseDto.kilometerPerLiter && createExpenseDto.distance) {
        const kmPerLiter = createExpenseDto.kilometerPerLiter;
        const distance = createExpenseDto.distance;
        const gasolinePrice = 6.28; // considera valor médio nacional do litro da gasolina como R$6,28

        if (!isNaN(kmPerLiter) && !isNaN(distance) && kmPerLiter > 0) {
          const fuelValue = (distance / kmPerLiter) * gasolinePrice;
          createExpenseDto.value = parseFloat(fuelValue.toFixed(2));
        }
      }

      // 2. Busca a request
      const request = await this.requestModel
        .findById(createExpenseDto.requestId)
        .populate('expenses')
        .exec();

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      const project = await this.projectModel.findById(request.project);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // 3. Calcula o valor total  
      const currentTotal = request.expenses.reduce(
        (sum, expense: any) => sum + Number(expense.value),
        0,
      );
      const newTotal = currentTotal + Number(createExpenseDto.value);

      if (newTotal > project.limit) {
        request.isOverLimit = true;
      }

      const expense = new this.expenseModel({
        ...createExpenseDto,
        image: fileKey,
      });

      await expense.save();

      request.expenses.push(expense._id);
      await request.save();

      const response: any = {
        ...expense.toObject(),
        requestId: request._id,
      };

      if (newTotal > project.limit) {
        response.limitWarningMessage = `O total das despesas (${newTotal}) excedeu o limite do projeto (${project.limit}).`;
      }

      return response;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro interno ao criar despesa');
    }
  }

  async getSignedImageUrl(fileKey: string): Promise<string> {
    if (!fileKey) return '';
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucketName, Key: fileKey }),
      { expiresIn: 3600 },
    );
  }

  async getExpenses(filters: ExpenseFiltersDto) {
    try {
      const { startDate, endDate, page = 1, limit = 15 } = filters;
      const filter: any = {};

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
      }

      const skip = (page - 1) * limit;

      const [expenses, total] = await Promise.all([
        this.expenseModel.find(filter).skip(skip).limit(limit).sort({ date: -1 }).exec(),
        this.expenseModel.countDocuments(filter),
      ]);

      for (const expense of expenses) {
        expense.image = await this.getSignedImageUrl(expense.image);
      }

      return {
        data: expenses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new InternalServerErrorException('Erro ao buscar despesas');
    }
  }



  async getExpenseById(id: string) {
    try {
      const expense = await this.expenseModel.findById(id).exec();
      if (!expense) {
        throw new NotFoundException('Despesa não encontrada');
      }

      expense.image = await this.getSignedImageUrl(expense.image);
      return expense;
    } catch (error) {
      console.error('Erro ao buscar despesa:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar despesa');
    }
  }

  async getDashboardStatsRaw(
    startDate: string,
    endDate: string,
    granularity: 'week' | 'month' | 'quarter' | 'semester',) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Data inicial e final são obrigatórias');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const expenses = await this.expenseModel
      .find({ date: { $gte: start, $lte: end } })
      .lean();

    const grouped: Record<
      string,
      { totalValue: number; types: Record<string, number> }
    > = {};

    for (const expense of expenses) {
      const date = dayjs(expense.date);

      let key: string;

      switch (granularity) {
        case 'week':
          key = date.startOf('week').format('YYYY-MM-DD');
          break;
        case 'month':
          key = date.startOf('month').format('YYYY-MM');
          break;
        case 'quarter':
          key = `${date.year()}-Q${Math.floor(date.month() / 3) + 1}`;
          break;
        case 'semester':
          key = `${date.year()}-S${Math.floor(date.month() / 6) + 1}`;
          break;
        default:
          throw new BadRequestException('Granularidade inválida');
      }

      if (!grouped[key]) {
        grouped[key] = { totalValue: 0, types: {} };
      }

      grouped[key].totalValue += expense.value;
      grouped[key].types[expense.type] = (grouped[key].types[expense.type] || 0) + 1;
    }

    const result = Object.entries(grouped).map(([period, data]) => ({
      period,
      totalValue: parseFloat(data.totalValue.toFixed(2)),
      types: Object.entries(data.types).map(([type, count]) => ({ type, count })),
    }));

    result.sort((a, b) => a.period.localeCompare(b.period));

    return result;
  }

  async updateExpense(id: string, updateExpense: UpdateExpenseDto) {
    try {
      const updated = await this.expenseModel
        .findByIdAndUpdate(id, updateExpense, { new: true })
        .exec();

      if (!updated) {
        throw new NotFoundException('Despesa não encontrada para atualização');
      }

      return updated;
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao atualizar despesa');
    }
  }

  async deleteExpense(id: string) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) throw new NotFoundException('Despesa não encontrada');

      if (expense.image) {
        await this.s3.send(
          new DeleteObjectCommand({ Bucket: this.bucketName, Key: expense.image }),
        );
      }

      await this.userModel.updateMany({ expenses: id }, { $pull: { expenses: id } });
      await this.expenseModel.findByIdAndDelete(id);

      return { message: 'Despesa deletada com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao deletar despesa');
    }
  }
}
