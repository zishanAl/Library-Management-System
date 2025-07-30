import { IsMongoId } from 'class-validator';

export class ReturnBookDto {
  @IsMongoId()
  transactionId: string;
}
