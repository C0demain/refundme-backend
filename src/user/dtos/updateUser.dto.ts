import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
    
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;
}