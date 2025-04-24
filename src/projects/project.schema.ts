import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import generateCode from 'src/utils/generateCode';

@Schema()
export class Project {
  @Prop({ required: true, default: () => generateCode(8) })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  cc: string;

  @Prop({ required: true })
  limit: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Request' }] })
  requests: Types.ObjectId[];

  @Prop({type: [{type: Types.ObjectId, ref: 'User'}]})
  users: Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
