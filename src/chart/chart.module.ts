import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from 'src/expense/expense.schema';
import { Project, ProjectSchema } from 'src/projects/project.schema';
import { RequestSchema } from 'src/requests/request.schema';
import { User, userSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: User.name, schema: userSchema },
      { name: Request.name, schema: RequestSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
