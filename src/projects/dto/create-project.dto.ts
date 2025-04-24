import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project 1', description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Description',
    description: 'Description of the project',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'CC-0001',
    description: 'Cost center of the project',
  })
  @IsString()
  @IsOptional()
  cc: string;

  @ApiProperty({
    example: 1000,
    description: 'Limit of the project',
  })
  @IsNotEmpty()
  limit: number;

  @ApiProperty({ type: [String], example: ['userId1', 'userId2'], description: 'Array of user IDs' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  users?: string[];
}
