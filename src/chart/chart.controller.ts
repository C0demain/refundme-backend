import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ApiOperation } from '@nestjs/swagger';
import { PeriodFilterDto } from './dtos/periodFilter.dto';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('/expenses/type')
  @ApiOperation({
    summary: 'Get expenses by type',
    description:
      'Retrieve expenses grouped by type within a specified date range.',
  })
  async getRequest(@Query() query: PeriodFilterDto) {
    return {
      message: 'Chart data retrieved successfully',
      data: await this.chartService.getExpensesByType(query),
    };
  }

  @Get('/requests/status')
  async getRequestByStatus() {
    return {
      message: 'Chart data retrieved successfully',
      data: await this.chartService.getRequestsByStatus(),
    };
  }
}
