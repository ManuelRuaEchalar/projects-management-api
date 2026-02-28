import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "generated/prisma/enums";

export class AuthLogInDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}