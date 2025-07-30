import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book as BookInterface } from './interfaces/books.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<BookInterface> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<BookInterface[]> {
    return this.booksService.findAll();
  }

  @Get('search')
  async search(@Query('title') title: string): Promise<BookInterface[]> {
    return this.booksService.searchByTitle(title);
  }
  
}
