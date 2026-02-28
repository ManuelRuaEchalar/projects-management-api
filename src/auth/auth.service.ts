import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { AuthLogInDto } from './dto/authLogIn.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signUp(authDto: AuthDto) {
        try {
            const user = await this.prisma.user.create({
                data: authDto
            });
            return user;

        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }

    }
    async signIn(authLogInDto: AuthLogInDto) { 
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: authLogInDto.email,
                },
            });

            if (!user) {
            throw new ForbiddenException('Credentials incorrect');
            }

        } catch (error){
            throw new InternalServerErrorException(error.message);

        }
    }
}
