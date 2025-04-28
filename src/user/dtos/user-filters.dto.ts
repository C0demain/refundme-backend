import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UserFiltersDto{
    @ApiProperty({description: 'Procura por nome ou código que contenha o texto', required: false})
    @IsOptional()
    @IsString()
    search?: string
}