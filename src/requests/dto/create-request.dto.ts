import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: 'Project 1', description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '67dd56d51458989c9c37d4c6',
    description: 'Id of parent project',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
