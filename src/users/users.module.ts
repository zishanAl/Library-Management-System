import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';  // Renamed to 'User'
import { Book, BookSchema } from '../books/schemas/book.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([  // Registered models for the User, Book, and Transaction schemas
      { name: User.name, schema: UserSchema },  // User schema
      { name: Book.name, schema: BookSchema },  // Book schema
      { name: Transaction.name, schema: TransactionSchema },  // Transaction schema
    ]),
  ],
  controllers: [UsersController],  // Updated to use 'UsersController'
  providers: [UsersService],  // Updated to use 'UsersService'
})
export class UsersModule {}
