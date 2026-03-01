import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthLogInDto } from './dto/authLogIn.dto';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signUp(dto);
    }

    @Post('signin')
    signin(dto: AuthLogInDto) {
        return this.authService.signIn(dto)    ;
    }

}
