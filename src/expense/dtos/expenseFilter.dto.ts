import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ExpenseFiltersDto {
  @ApiProperty({ required: false, description: 'Data inicial para filtrar as despesas (formato ISO)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'Data final para filtrar as despesas (formato ISO)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Quantidade de itens por página', default: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 15;
}
