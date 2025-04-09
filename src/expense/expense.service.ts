import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import { Request } from 'src/requests/request.schema';
import { Project } from 'src/projects/project.schema';

@Injectable()
export class ExpenseService {
  private s3: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME || "";
  private bucketRegion = process.env.AWS_REGION || "";
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>
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
    try {
      let fileKey = "";
      if (file) {
        fileKey = `receipts/${crypto.randomUUID()}-${file.originalname}`;
        
        await this.s3.send(new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }));
      }

      const request = await this.requestModel.findById(createExpenseDto.requestId).populate('expenses').exec();
      if (!request) {
        throw new Error('Request not found');
      }

      const project = await this.projectModel.findById(request.project);
      if (!project) {
        throw new Error('Project not found');
      }

      const currentTotal = request.expenses.reduce((sum, expense: any) => sum + Number(expense.value), 0);
      const newTotal = currentTotal + Number(createExpenseDto.value);
      

      if (newTotal > project.limit) {
        request.isOverLimit = true;
      }
      
      const expense = new this.expenseModel({
        ...createExpenseDto,
        image: fileKey, // Guardamos apenas a chave do arquivo, não a URL
      });
      await expense.save();

      request.expenses.push(expense._id);
      await request.save();
      
      const response: any = {
        ...expense.toObject(),
        requestId: request._id
      };
  
      if (newTotal > project.limit) {
        response.limitWarningMessage = `O total das despesas (${newTotal}) excedeu o limite do projeto (${project.limit}).`;
      }
  
      return response;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw new Error('Expense not created');
    }
  }

  async getSignedImageUrl(fileKey: string): Promise<string> {
    if (!fileKey) return "";
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucketName, Key: fileKey }), { expiresIn: 3600 });
  }

  async getExpenses() {
    const expenses = await this.expenseModel.find().populate('user', 'id name').exec();
    for (const expense of expenses) {
      expense.image = await this.getSignedImageUrl(expense.image);
    }
    return expenses;
  }

  async getExpenseById(id: string) {
    const expense = await this.expenseModel.findById(id).exec();
    if (expense) {
      expense.image = await this.getSignedImageUrl(expense.image);
    }
    return expense;
  }

  async updateExpense(id: string, updateExpense: UpdateExpenseDto) {
    return this.expenseModel.findByIdAndUpdate(id, updateExpense, { new: true }).exec();
  }

  async deleteExpense(id: string) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) throw new Error('Expense not found');
      
      if (expense.image) {
        await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: expense.image }));
      }
      
      await this.userModel.updateMany({ expenses: id }, { $pull: { expenses: id } });
      await this.expenseModel.findByIdAndDelete(id);
      
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      throw new Error('Expense not deleted');
    }
  }
}
