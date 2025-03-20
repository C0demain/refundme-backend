import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  image: string; // Agora armazena a URL da imagem no Supabase
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
