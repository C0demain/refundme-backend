import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        const response = await this.authService.login(loginDto)
        return response
    }
}
