import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsInt } from "class-validator";

export class ProjectFiltersDto {
  @ApiProperty({ description: 'Filtro por centro de custo do projeto', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cc?: string;

  @ApiProperty({ description: 'Procura por nome ou código que contenha o texto', required: false })
  @IsOptional()
  @IsString()
  search?: string;

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
