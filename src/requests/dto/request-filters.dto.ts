import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StatusEnum } from "src/utils/enums/status.enum";

export class RequestFiltersDto{
    @ApiProperty({description: 'Filtra status (Pendente, Aprovado, Recusado)', required: false})
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum

    @ApiProperty({description: 'Filtro por id do projeto', required: false})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    project?: string

    @ApiProperty({description: 'Procura por nome ou código que contenha o texto', required: false})
    @IsOptional()
    @IsString()
    search?: string
}