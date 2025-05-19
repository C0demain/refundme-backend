import { Controller, Get } from '@nestjs/common';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get()
  getRequest() {
    return {
      message: 'Chart data retrieved successfully',
    };
  }
}
