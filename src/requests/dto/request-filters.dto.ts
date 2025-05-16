import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { StatusEnum } from 'src/utils/enums/status.enum';
import { Type } from 'class-transformer';

export class RequestFiltersDto {
  @ApiProperty({ description: 'Filtra status (PENDENTE, APROVADO, RECUSADO)', required: false })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiProperty({ description: 'Filtro por id do projeto', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project?: string;

  @ApiProperty({ description: 'Procura por título ou código que contenha o texto', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Número da página', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Quantidade de itens por página', required: false, default: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 15;
}
