import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async createExpense(createExpenseDto: CreateExpenseDto) {
    try {
      return this.expenseModel.create(createExpenseDto);
    } catch (error) {
      throw new Error('Expense not created');
    }
  }

  async getExpenses() {
    try {
      return this.expenseModel.find().exec();
    } catch (error) {
      throw new Error('Expenses not found');
    }
  }

  async getExpenseById(id: string) {
    try {
      return this.expenseModel.findById(id).exec();
    } catch (error) {
      throw new Error('Expense not found');
    }
  }

  async updateExpense(id: string, updateExpense: UpdateExpenseDto) {
    try {
      return this.expenseModel
        .findByIdAndUpdate(id, updateExpense, { new: true })
        .exec();
    } catch (error) {
      throw new Error('Expense not updated');
    }
  }

  async deleteExpense(id: string) {
    return this.expenseModel.findByIdAndDelete(id).exec();
  }
}
