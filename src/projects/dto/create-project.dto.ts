import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
}
