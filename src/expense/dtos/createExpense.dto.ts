import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  value: number;

  @IsString()
  @IsNotEmpty()
  userId:string

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  image?:string;
}
