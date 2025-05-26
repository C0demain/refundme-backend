import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";


export class UserFiltersDto {
  @ApiProperty({ description: 'Procura por nome ou email que contenha o texto', required: false })
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