import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './request.schema';
import { Project } from 'src/projects/project.schema';
import { RequestFiltersDto } from 'src/requests/dto/request-filters.dto';
import parseSearch from 'src/utils/parseSearch';
import { Expense } from 'src/expense/expense.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = new this.requestModel({
      ...createRequestDto,
      project: createRequestDto.projectId,
      user: createRequestDto.userId,
    });
  
    const project = await this.projectModel.findById(createRequestDto.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    const user = await this.userModel.findById(createRequestDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const savedRequest = await request.save();

    user.requests.push(savedRequest._id);
    await user.save();
    
    project.requests.push(savedRequest._id);
    await project.save();
  
    return savedRequest;
  }
  

  async findAll(queryFilters: RequestFiltersDto) {
    const { search, ...filters } = queryFilters;
    const searchParams = parseSearch(search, ['title', 'code']);

    return await this.requestModel.find({
      ...filters,
      ...searchParams,
    })
    .populate('expenses')
    .populate({
      path: 'project',
      select: 'id title code'
    })
    .populate('user', 'id name');
  }

  async findOne(id: string) {
    return await this.requestModel.findById(id).populate('expenses')
    .populate({
      path: 'project',
      select: 'id title code'
    })
    .populate('expenses')
    .populate('user', 'id name')
    ;
  }

  async findRequestsByUserId(userId: string, queryFilters: RequestFiltersDto): Promise<Request[]> {
    const { search, ...filters } = queryFilters;
    const searchParams = parseSearch(search, ['title', 'code']);
    console.debug(searchParams, filters)

    const userExpenses = await this.expenseModel.find({ user: userId }).select('_id');
    const expenseIds = userExpenses.map(e => e._id);
  
    return this.requestModel.find({ expenses: { $in: expenseIds }, ...filters, ...searchParams }).populate('expenses')
    .populate({
      path: 'project',
      select: 'id title code'
    })
    .populate('expenses')
    .populate('user', 'id name');
  }

  async update(id: string, projectRequestData: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(
      { _id: id },
      projectRequestData,
      { new: true },
    ).exec()
  }

  async remove(id: string) {
    await this.requestModel.deleteOne({ _id: id }).exec();
    return `Project with ${id} was removed`;
  }
}
