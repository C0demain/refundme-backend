import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'secret',
      signOptions:{
        expiresIn: '1h'
      }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule, PassportModule]
})
export class AuthModule {}
