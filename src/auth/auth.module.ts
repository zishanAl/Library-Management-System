import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose'; 
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema'; 

@Module({
  imports: [
    UsersModule,  
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,  
    }),
    MongooseModule.forFeature([  
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
