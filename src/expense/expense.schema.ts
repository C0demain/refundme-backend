import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Expense {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: Date.now() })
  date: Date;

  @Prop()
  description: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
