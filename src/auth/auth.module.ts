import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {config} from 'dotenv'

config() // load env vars
@Module({
  imports: [
    UserModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn: '1d'
      }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
