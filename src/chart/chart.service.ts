import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/expense/expense.schema';
import { Project } from 'src/projects/project.schema';
import { User } from 'src/user/user.schema';
import {
  DateGranularity,
  ExpenseByType,
  RequestByStatus,
} from 'src/utils/types/chart.types';
import { PeriodFilterDto } from './dtos/periodFilter.dto';

@Injectable()
export class ChartService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  dateExprMap: Record<DateGranularity, object> = {
    week: {
      $dateTrunc: {
        date: '$date',
        unit: 'week',
        binSize: 1,
      },
    },
    month: {
      $dateTrunc: {
        date: '$date',
        unit: 'month',
      },
    },
    quarter: {
      $dateTrunc: {
        date: '$date',
        unit: 'quarter',
      },
    },
    semester: {
      $dateFromParts: {
        year: { $year: '$date' },
        month: {
          $cond: [{ $lte: [{ $month: '$date' }, 6] }, 1, 7],
        },
        day: 1,
      },
    },
  };

  async getExpensesByType(query: PeriodFilterDto): Promise<ExpenseByType[]> {
    const { startDate, endDate, granularity } = query;
    if (!startDate || !endDate) {
      throw new BadRequestException('Data inicial e final são obrigatórias');
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException(
        'Data inicial não pode ser maior que a final',
      );
    }
    if (!['week', 'month', 'quarter', 'semester'].includes(granularity)) {
      throw new BadRequestException(
        'Granularidade deve ser "week", "month", "quarter" ou "semester"',
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result: ExpenseByType[] = await this.expenseModel.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            date: this.dateExprMap[granularity],
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
          date: {
            $dateToString: {
              format: '%Y/%m/%d',
              date: '$_id',
            },
          },
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
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  }

  async getRequestsByStatus(): Promise<RequestByStatus[]> {
    const result: RequestByStatus[] = await this.requestModel.aggregate([
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 },
        },
      },
    ]);

    return result;
  }

  async getExpensesValueByPeriod(query: PeriodFilterDto): Promise<any[]> {
    const { startDate, endDate, granularity } = query;
    if (!startDate || !endDate) {
      throw new BadRequestException('Data inicial e final são obrigatórias');
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException(
        'Data inicial não pode ser maior que a final',
      );
    }
    if (!['week', 'month', 'quarter', 'semester'].includes(granularity)) {
      throw new BadRequestException(
        'Granularidade deve ser "week", "month", "quarter" ou "semester"',
      );
    }

    endDate.setHours(23, 59, 59, 999);

    const result = await this.expenseModel.aggregate([
      {
        $group: {
          _id: {
            date: this.dateExprMap[granularity],
          },
          total: {
            $sum: '$value',
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y/%m/%d',
              date: '$_id.date',
            },
          },
          data: '$total',
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    return result;
  }
}
