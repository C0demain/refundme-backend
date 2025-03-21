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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Expenses')
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create an expense with optional image upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number', example: 100.5 },
        userId: { type: 'string', example: '60d21b4667d0d8992e610c85' },
        type: { type: 'string', example: 'Food' },
        date: { type: 'string', format: 'date-time', example: '2023-05-20T14:48:00.000Z' },
        description: { type: 'string', example: 'Lunch at a restaurant' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  async create(
    @Body() createExpenseDto: CreateExpenseDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      message: 'Expense created successfully',
      data: await this.expenseService.createExpense(createExpenseDto, file),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all expenses' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  async findAll() {
    return {
      message: 'Expenses retrieved successfully',
      data: await this.expenseService.getExpenses(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an expense by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string) {
    return {
      message: 'Expense retrieved successfully',
      data: await this.expenseService.getExpenseById(id),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiBody({type: UpdateExpenseDto})
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
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async remove(@Param('id') id: string) {
    return {
      message: 'Expense deleted successfully',
      data: await this.expenseService.deleteExpense(id),
    };
  }
}
