import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { config } from "dotenv";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "src/auth/auth.service";

config() // load env vars
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            secretOrKey: `${process.env.JWT_SECRET}`,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        })
    }
    async validate(payload: any) {
        return { user_id: payload.id, email: payload.email }; // Retorna apenas os dados necessários
    }
    
}