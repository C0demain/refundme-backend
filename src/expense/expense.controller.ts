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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/user/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Expenses')
@ApiBearerAuth()
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
        requestId: {type: 'string', example: '60d21b4667d0d8992e610c85'},
        type: { type: 'string', example: 'Food' },
        date: { type: 'string', format: 'date-time', example: '2023-05-20T14:48:00.000Z' },
        description: { type: 'string', example: 'Lunch at a restaurant' },
        image: { type: 'string', format: 'binary' },
        kilometerPerLiter: { type: 'number', example: 10 },
        distance: { type: 'number', example: 100 }
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  async create(
    @Body() createExpenseDto: CreateExpenseDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.expenseService.createExpense(createExpenseDto, file)

    return {
      message: 'Expense created successfully',
      data: data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all expenses (optionally filtered by date)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,) {
    const expenses = await this.expenseService.getExpenses(startDate, endDate);
    return {
      message: 'Expenses retrieved successfully',
      data: expenses,
    };
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Dashboard grouped expenses by period and type (raw method)' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({ name: 'granularity', required: true, enum: ['week', 'month', 'quarter', 'semester'] })
  @ApiResponse({ status: 200, description: 'Grouped dashboard data retrieved successfully' })
  async getDashboardStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('granularity') granularity: 'week' | 'month' | 'quarter' | 'semester',) {
    const data = await this.expenseService.getDashboardStatsRaw(startDate, endDate, granularity);
    return {
      message: 'Grouped dashboard data retrieved successfully',
      data,
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
