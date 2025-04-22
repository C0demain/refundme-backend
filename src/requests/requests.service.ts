import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      const request = new this.requestModel({
        ...createRequestDto,
        project: createRequestDto.projectId,
        user: createRequestDto.userId,
      });

      const project = await this.projectModel.findById(createRequestDto.projectId);
      if (!project) {
        throw new NotFoundException('Projeto não encontrado');
      }

      const user = await this.userModel.findById(createRequestDto.userId);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const savedRequest = await request.save();

      user.requests.push(savedRequest._id);
      await user.save();

      project.requests.push(savedRequest._id);
      await project.save();

      return savedRequest;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw new HttpException('Erro ao criar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(queryFilters: RequestFiltersDto) {
    try {
      const { search, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['title', 'code']);

      return await this.requestModel.find({
        ...filters,
        ...searchParams,
      })
      .populate('expenses')
      .populate({ path: 'project', select: 'id title code' })
      .populate('user', 'id name');
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      throw new HttpException('Erro ao buscar solicitações', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.requestModel.findById(id)
        .populate('expenses')
        .populate({ path: 'project', select: 'id title code' })
        .populate('user', 'id name');

      if (!request) {
        throw new NotFoundException(`Solicitação com id ${id} não encontrada`);
      }

      return request;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar solicitação:', error);
      throw new HttpException('Erro ao buscar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findRequestsByUserId(userId: string, queryFilters: RequestFiltersDto): Promise<Request[]> {
    try {
      const { search, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['title', 'code']);
  
      const query: any = {
        user: userId,
        ...filters,
        ...searchParams,
      };
      const requests = await this.requestModel
        .find(query)
        .populate('expenses')
        .populate({ path: 'project', select: 'id title code' })
        .populate({ path: 'user', select: 'id name' });

      return requests;
  
    } catch (error) {
      console.error('Erro ao buscar solicitações do usuário:', error);
      throw new HttpException('Erro ao buscar solicitações do usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, projectRequestData: UpdateRequestDto) {
    try {
      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        { _id: id },
        projectRequestData,
        { new: true }
      );

      if (!updatedRequest) {
        throw new NotFoundException(`Solicitação com id ${id} não encontrada`);
      }

      return updatedRequest;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao atualizar solicitação:', error);
      throw new HttpException('Erro ao atualizar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.requestModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Solicitação com id ${id} não encontrada`);
      }

      return { message: `Solicitação com id ${id} removida com sucesso` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao deletar solicitação:', error);
      throw new HttpException('Erro ao deletar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
