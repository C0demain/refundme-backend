import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProjectFiltersDto{
    @ApiProperty({description: 'Filtro por centro de custo do projeto', required: false})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cc?: string
}