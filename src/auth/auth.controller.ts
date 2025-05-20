import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and generate JWT token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @ApiHeader({
    name: 'client-type',
    description: 'Tipo do cliente',
    required: true,
    schema: { type: 'string', enum: ['mobile', 'web'] },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('client-type') clientType: string
  ) {
    return await this.authService.login(loginDto, clientType);
  }
}