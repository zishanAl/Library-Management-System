export interface UserStatus {
  name: string;

  activeBooks: {
    bookTitle: string;
    borrowDate: Date;
  }[];

  returnedBooks: {
    bookTitle: string;
    returnDate: Date;
    charge: number;
  }[];

  activeBookCount: number;
  returnedBookCount: number;
  totalCharge: number;
}
