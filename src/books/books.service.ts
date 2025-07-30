import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book as BookSchema, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { Book as BookInterface } from './interfaces/books.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(BookSchema.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto) : Promise<BookInterface> {
    const newBook = new this.bookModel(createBookDto);
    const savedBook = await newBook.save();

    return this.toInterface(savedBook);
  }

  async findAll(): Promise<BookInterface[]> {
    const books = await this.bookModel.find().lean();
    return books.map(this.toInterface);
  }

  async searchByTitle(title: string): Promise<BookInterface[]> {
    const books = await this.bookModel.find({
      title: { $regex: new RegExp(title, 'i') },
    }).lean();

    return books.map(this.toInterface);
  }

  private toInterface(book: any): BookInterface {
    return {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      quantity: book.quantity,
    };
  }
}
