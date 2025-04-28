import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersToProjectDto {
  @ApiProperty({ type: [String], example: ['userId1', 'userId2'] })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
