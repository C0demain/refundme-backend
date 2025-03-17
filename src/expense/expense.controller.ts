import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return {
      message: 'Expense created successfully',
      data: await this.expenseService.createExpense(createExpenseDto),
    };
  }

  @Get()
  async findAll() {
    return {
      message: 'Expenses retrieved successfully',
      data: await this.expenseService.getExpenses(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Expense retrieved successfully',
      data: await this.expenseService.getExpenseById(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return {
      message: 'Expense updated successfully',
      data: await this.expenseService.updateExpense(id, updateExpenseDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Expense deleted successfully',
      data: await this.expenseService.deleteExpense(id),
    };
  }
}
