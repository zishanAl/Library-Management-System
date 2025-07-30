import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()  
  email: string;

  @IsString()
  @MinLength(6)  
  password: string;

  @IsEnum(['student', 'librarian'])  
  role: 'student' | 'librarian';
}
