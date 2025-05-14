import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email)
        if (user && user.password === password) return user;
        return null
    }

    async login(loginDto: LoginDto) {
        const { email, password, frontend } = loginDto;

        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (user.password !== password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Bloqueia acesso para role=admin no mobile
        if (user.role === 'admin' && frontend !== 'web') {
            throw new UnauthorizedException('Admin users cannot access the mobile app.');
        }

        // Bloqueia acesso para role=user no web
        if (user.role === 'user' && frontend !== 'mobile') {
            throw new UnauthorizedException('Regular users cannot access the web app.');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            frontend
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            user_id: user.id,
            access_token: token,
            role: user.role,
            frontend: frontend
        }

    }
}
