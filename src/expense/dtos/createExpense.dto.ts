import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 100.5, description: 'Value of the expense' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  value: number;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'User ID associated with the expense',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Request ID associated with the expense',
  })
  requestId: string;

  @ApiProperty({ example: 'Food', description: 'Type of the expense' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    example: '2023-05-20T14:48:00.000Z',
    description: 'Date of the expense',
  })
  @IsDateString()
  @IsOptional()
  date: Date;

  @ApiPropertyOptional({
    example: 'Lunch at a restaurant',
    description: 'Description of the expense',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'image-url',
    description: 'Image associated with the expense',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
