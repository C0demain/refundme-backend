import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { DateGranularity } from 'src/utils/types/chart.types';

export class PeriodFilterDto {
  @ApiProperty({
    required: false,
    description: 'Data inicial para filtrar as despesas (formato ISO)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    required: false,
    description: 'Data final para filtrar as despesas (formato ISO)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    required: false,
    description: 'Número da página',
    default: 1,
  })
  @IsOptional()
  granularity: DateGranularity = 'month';
}
