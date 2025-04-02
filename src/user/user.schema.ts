import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Role } from './enums/role.enum';
import { IsEnum } from 'class-validator';

@Schema()
export class User{
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }] }) 
  expenses: Types.ObjectId[];

  @Prop({ required: true, default: Role.USER })
  @IsEnum(Role)
  role: Role;
}

export const userSchema = SchemaFactory.createForClass(User);
