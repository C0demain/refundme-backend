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
  value: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  description: string;
}
