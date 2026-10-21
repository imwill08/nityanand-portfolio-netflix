import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<{ username: string }> {
    const adminUser = this.configService.get<string>('ADMIN_USERNAME') || 'admin';
    const adminPass = this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';

    if (loginDto.username === adminUser && loginDto.password === adminPass) {
      return { username: adminUser };
    }
    throw new UnauthorizedException('Invalid admin credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { username: user.username, sub: 'admin' };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        username: user.username,
      },
    };
  }
}
