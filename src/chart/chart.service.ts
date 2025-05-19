import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/expense/expense.schema';
import { Project } from 'src/projects/project.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class ChartService {
  constructor() {}
}
