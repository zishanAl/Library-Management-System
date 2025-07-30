import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Transaction, TransactionDocument } from '../transactions/schemas/transaction.schema';
import { Book } from '../books/schemas/book.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();  // Find and return the user by email
  }

  async create(registerDto: RegisterDto): Promise<UserDocument> {
    const { name, email, password, role } = registerDto;
    const newUser = new this.userModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),  // Hash password before saving
      role,
    });
    return newUser.save();  // Save the user in the database and return it
  }
  // This method will be used to get a user's status (active books, returned books, total charge, etc.)
  async getUserStatus(id: string): Promise<any> {
    const userDoc = await this.userModel.findById(id);
    if (!userDoc) throw new NotFoundException('User not found');

    const transactions = await this.transactionModel
      .find({ userId: id })
      .populate<{ bookId: Book }>('bookId');

    const today = new Date();

    const activeBooks: { bookTitle: string; borrowDate: Date }[] = [];
    const returnedBooks: { bookTitle: string; returnDate: Date; charge: number }[] = [];

    for (const tx of transactions) {
      const book = tx.bookId as Book;

      if (!tx.returnDate) {
        activeBooks.push({
          bookTitle: book.title,
          borrowDate: tx.borrowDate,
        });
      } else {
        returnedBooks.push({
          bookTitle: book.title,
          returnDate: tx.returnDate,
          charge: tx.charge,
        });
      }
    }

    const totalCharge = returnedBooks.reduce((sum, b) => sum + b.charge, 0);

    return {
      name: userDoc.name,
      activeBooks,
      returnedBooks,
      activeBookCount: activeBooks.length,
      returnedBookCount: returnedBooks.length,
      totalCharge,
    };
  }

  // Helper function to map User document to User interface
  // private toInterface(user: UserDocument): UserInterface {
  //   return {
  //     id: (user._id as Types.ObjectId).toString(),
  //     name: user.name,
  //     email: user.email,
  //     role: user.role as "student" | "librarian",
  //   };
  // }
}
