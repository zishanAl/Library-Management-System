import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { TransactionInterface } from './interfaces/transactions.interface';
import { Student, StudentDocument } from '../auth/schemas/user.schema';
import { Book, BookDocument } from '../books/schemas/book.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async borrowBook(dto: BorrowBookDto): Promise<TransactionInterface> {
    const { studentId, bookId } = dto;
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');
  
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('Book not found');
  
    const activeBorrows = await this.transactionModel.countDocuments({
      studentId,
      returnDate: null,
    });
    if (activeBorrows >= 5) throw new BadRequestException('Student already borrowed 5 books');
  
    // Atomic update to decrease book quantity (lock)
    const updatedBook = await this.bookModel.findOneAndUpdate(
      { _id: bookId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!updatedBook) throw new BadRequestException('Book not available');

    const transaction = new this.transactionModel({
      studentId,
      bookId,
      borrowDate: new Date(),
      returnDate: null,
      charge: 0,
    });
  
    const saved = await transaction.save();
    return this.toInterface(saved);
  }

  async returnBook(dto: ReturnBookDto): Promise<TransactionInterface> {
    const transaction = await this.transactionModel.findById(dto.transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.returnDate) throw new BadRequestException('Book already returned');
    // increase book quantity (lock)
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      transaction.bookId,
      { $inc: { quantity: 1 } },
      { new: true }
    );
    if (!updatedBook) throw new BadRequestException('Book not available for return');
    
    const today = new Date();
    const daysBorrowed = Math.ceil((+today - +new Date(transaction.borrowDate)) / (1000 * 60 * 60 * 24));
    const charge = Math.max(0, daysBorrowed - 10) * 1;

    transaction.returnDate = today;
    transaction.charge = charge;
    const updated = await transaction.save();
    return this.toInterface(updated);
  }

  private toInterface(tx: TransactionDocument): TransactionInterface {
    return {
      id: (tx._id as Types.ObjectId).toString(),
      studentId: tx.studentId.toString(),
      bookId: tx.bookId.toString(),
      borrowDate: tx.borrowDate,
      returnDate: tx.returnDate,
      charge: tx.charge,
    };
  }
}
