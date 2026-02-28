import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "generated/prisma/enums";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}