import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
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
}