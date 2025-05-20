import { Controller, Get } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('/expenses/type')
  @ApiOperation({
    summary: 'Get expenses by type',
    description:
      'Retrieve expenses grouped by type within a specified date range.',
  })
  async getRequest() {
    const startDate = '2025-01-01'; // Replace with actual start date
    const endDate = '2025-12-31'; // Replace with actual end date
    const granularity: 'week' | 'month' | 'quarter' | 'semester' = 'month'; // Replace with desired granularity

    return {
      message: 'Chart data retrieved successfully',
      data: await this.chartService.getExpensesByType(
        startDate,
        endDate,
        granularity,
      ),
    };
  }
}
