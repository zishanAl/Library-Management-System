import { IsMongoId } from 'class-validator';

export class BorrowBookDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  bookId: string;
}
