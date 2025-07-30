import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken extends Document {
  @Prop({ required: true })
  token: string;  

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;  

  @Prop({ required: true })
  expiryDate: Date;  
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
