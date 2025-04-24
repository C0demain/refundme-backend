import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    type: [String],
    example: ['userId1', 'userId2'],
    description: 'Updated array of user IDs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  users?: string[];
}
