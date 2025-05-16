import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from "class-validator";

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

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 15 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 15;
}
