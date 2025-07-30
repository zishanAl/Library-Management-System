import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()  // Ensures the email is a valid email
  email: string;

  @IsString()
  @MinLength(6)  // Ensures password is at least 6 characters long (you can adjust this length as needed)
  password: string;
}
