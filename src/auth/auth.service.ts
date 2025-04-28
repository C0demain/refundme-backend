import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string){
        const user = await this.userService.getUserByEmail(email)
        if(user && user.password === password) return user;
        return null
    }

    async login(loginDto: LoginDto){
        const {email, password} = loginDto
        const user = await this.userService.getUserByEmail(email)
        if(!user){
            throw new UnauthorizedException('Invalid email or password')
        }

        if(user.password !== password){
            throw new UnauthorizedException('Invalid email or password')
        }

        const token = await this.jwtService.signAsync(user.toJSON())
        
        return { 
            user_id: user.id, 
            access_token: token,
            role: user.role
        }

    }
}
