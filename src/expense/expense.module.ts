import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.schema';
import { User, userSchema } from 'src/user/user.schema';
import { Request, RequestSchema } from 'src/requests/request.schema';
import { Project, ProjectSchema } from 'src/projects/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      {name: User.name, schema:userSchema},
      {name: Request.name, schema:RequestSchema},
      { name: Project.name, schema: ProjectSchema }
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
