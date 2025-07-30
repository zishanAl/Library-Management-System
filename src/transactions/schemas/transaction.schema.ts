import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({ required: true })
  borrowDate: Date;

  @Prop({ default: null })
  returnDate?: Date;

  @Prop({ default: 0 })
  charge: number;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
