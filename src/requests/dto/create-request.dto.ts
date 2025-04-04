import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/utils/enums/status.enum';

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
  @IsMongoId()
  projectId: string;

  @ApiProperty({
    example: 'Pendente',
    description: 'Status of the request',
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
