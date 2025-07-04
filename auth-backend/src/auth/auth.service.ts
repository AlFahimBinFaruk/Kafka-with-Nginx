import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.userService.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      });

      return { message: 'User registered successfully.' };
    } catch (error) {
      console.log(
        'XXXX ==> Auth backend -> auth service -> register error: ',
        error,
      );
      return { message: 'Some error occured!!' };
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userService.findByEmail(dto.email);
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid creds.');
      }
      const payload = { sub: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload);
      return { access_token: token };
    } catch (error) {
      console.log(
        'XXXX ==> Auth backend -> auth service -> register error: ',
        error,
      );
      return { message: 'Some error occured!!' };
    }
  }
}
