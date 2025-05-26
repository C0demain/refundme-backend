import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './request.schema';
import { Project, ProjectSchema } from 'src/projects/project.schema';
import { Expense, ExpenseSchema } from 'src/expense/expense.schema';
import { User, userSchema } from 'src/user/user.schema';
import { ExpenseService } from 'src/expense/expense.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema}]),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema}]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, ExpenseService],
})
export class RequestsModule {}
