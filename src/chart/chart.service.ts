import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { Expense } from 'src/expense/expense.schema';
import { Project } from 'src/projects/project.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class ChartService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  // getExpensesByType() {
  //   const chartData = [
  //     {
  //       date: '2024-01-01',
  //       alimentação: 1000,
  //       transporte: 2000,
  //       hospedagem: 1000,
  //     },
  //   ];
  // }

  async getExpensesByType(
    startDate: string,
    endDate: string,
    granularity: 'week' | 'month' | 'quarter' | 'semester',
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Data inicial e final são obrigatórias');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = await this.expenseModel.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m',
                date: '$date',
                timezone: 'America/Sao_Paulo',
              },
            },
            type: '$type',
          },
          total: { $sum: '$value' },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          types: {
            $push: {
              k: '$_id.type',
              v: '$total',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          data: {
            $arrayToObject: '$types',
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ date: '$date' }, '$data'],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return result;
  }
}
