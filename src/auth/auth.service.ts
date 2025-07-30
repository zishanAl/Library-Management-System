import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';  // Now referring to UsersService
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService ,
    @InjectModel(RefreshToken.name) private RefreshTokenService: Model<RefreshToken>,  // Service to handle refresh tokens
    private jwtService: JwtService,
  ) { }

  // Register a new user (student or librarian)
  async register(registerDto: RegisterDto) {
    const { name, email, password, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email); 
    if (existingUser) {
      throw new Error('User already exists'); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      role,  
    });
  }

  // User login (authentication)
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);  // Generate JWT token after successful login
  }

  // Refresh token to get a new access token
  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenService.findOneAndDelete({
      token: refreshToken,
      expiryDate: { $gt: new Date() }  // Check if the token is not expired
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');  
    }

    return this.generateJwt(token.user); 
  }

  // Generate JWT token
  async generateJwt(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,  
    };

    const accessToken = this.jwtService.sign({ payload }, { expiresIn: '1h' });
    const refreshToken = uuidv4();  // Generate a new refresh token

    await this.storeRefreshToken(user.id, refreshToken);  // Store refresh token in the database
    return {
      accessToken,
      refreshToken,
    };
  }

  // Store refresh token in the database
  async storeRefreshToken(userId: string, refreshToken: string) {
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiry date to 7 days from now
    const token = await this.RefreshTokenService.create({ token: refreshToken, user: userId, expiryDate });
    return token;
  }
}
