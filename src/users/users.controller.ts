import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserStatus } from './interfaces/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch user status (active books, charges, etc.)
  @Get(':id/status')
  async getUserStatus(@Param('id') id: string): Promise<UserStatus> {
    return this.usersService.getUserStatus(id); // Fetch user status based on user ID
  }
}
