import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { TransactionInterface } from './interfaces/transactions.interface';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('borrow')
  borrowBook(@Body() dto: BorrowBookDto): Promise<TransactionInterface> {
    return this.transactionsService.borrowBook(dto);
  }

  @Post('return')
  returnBook(@Body() dto: ReturnBookDto): Promise<TransactionInterface> {
    return this.transactionsService.returnBook(dto);
  }
}
