import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { StatusEnum } from 'src/utils/enums/status.enum';
import generateCode from 'src/utils/generateCode';

@Schema()
export class Request {
  @Prop({ required: true, default: () => generateCode(8) })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: StatusEnum.DRAFT, enum: StatusEnum })
  status: StatusEnum;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Expense' }] })
  expenses: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  isOverLimit: boolean;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
