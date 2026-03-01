import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { AuthLogInDto } from './dto/authLogIn.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signUp(authDto: AuthDto) {
        try {
            const hash = await argon.hash(authDto.password)
            const user = await this.prisma.user.create({
                data: {
                    email: authDto.email,
                    password: hash,
                    fullName: authDto.fullName,
                    role: authDto.role
                }, select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt:true
                }
            });
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }
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

            const pwMatches = await argon.verify(user.password, authLogInDto.password);
            if (!pwMatches) {
                throw new ForbiddenException('Credentials incorrect');
            }

            const {password, ...userWithoutPassword } = user;
            return this.signToken(user.id, user.email);

        } catch (error){
            throw new InternalServerErrorException(error.message);

        }
    }

    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn:'15m',
            secret: secret,
        });

        return {
            access_token: token,
        }
    }
}
