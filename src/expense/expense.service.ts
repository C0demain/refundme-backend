import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { Expense } from './expense.schema';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async createExpense(createExpenseDto: CreateExpenseDto) {
    return this.expenseModel.create(createExpenseDto);
  }

  async getExpenses() {
    return this.expenseModel.find().exec();
  }

  async getExpenseById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new NotFoundException(`Despesa com id ${id} não encontrada`);
    }
    return expense;
  }

  async updateExpense(id: string, updateExpense: UpdateExpenseDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
    const expense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpense, { new: true })
      .exec();

    if (!expense) {
      throw new NotFoundException(`Despesa com id ${id} não encontrada`); 
    }
    return expense;
  }

  async deleteExpense(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
    return this.expenseModel.findByIdAndDelete(id).exec();
  }
}
