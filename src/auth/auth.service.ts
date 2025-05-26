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

    async login(loginDto: LoginDto, clientType: string) {
        const { email, password } = loginDto;

        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }

        if (user.password !== password) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }

        // Validação baseada na role e no tipo de cliente
        if (user.role === 'admin' && clientType !== 'web') {
            throw new UnauthorizedException('Usuários administradores podem acessar apenas a versão web do sistema.');
        }

        if (user.role === 'user' && clientType !== 'mobile') {
            throw new UnauthorizedException('Usuários comuns podem acessar apenas a versão mobile do sistema.');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            clientType
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            user_id: user.id,
            access_token: token,
            role: user.role,
            clientType
        }

    }
}
