import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Expense {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  description: string;

  @Prop()
  image: string; // armazena o caminho absoluto no bucket, no get é transformado em url

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Request' })
  request: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
