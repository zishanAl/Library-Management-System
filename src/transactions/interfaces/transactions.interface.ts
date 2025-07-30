export interface TransactionInterface {
  id: string;
  studentId: string;
  bookId: string;
  borrowDate: Date;
  returnDate?: Date;
  charge: number;
}
