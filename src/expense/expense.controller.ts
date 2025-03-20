import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body()createExpenseDto: CreateExpenseDto, @UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Expense created successfully',
      data: await this.expenseService.createExpense(createExpenseDto,file),
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
