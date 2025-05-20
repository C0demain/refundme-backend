import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectFiltersDto } from 'src/projects/dto/project-filters.dto';
import parseSearch from 'src/utils/parseSearch';
import { RequestFiltersDto } from 'src/requests/dto/request-filters.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(createProjectDto: CreateProjectDto){
    const session = await this.projectModel.db.startSession();
    session.startTransaction();
  
    try {
      const { users, ...projectData } = createProjectDto;
  
      const project = new this.projectModel({
        ...projectData,
        users: users || [],
      });
  
      const savedProject = await project.save({ session });
  
      if (users && users.length > 0) {
        await this.userModel.updateMany(
          { _id: { $in: users } },
          { $addToSet: { projects: savedProject._id } },
          { session }
        );
      }
  
      await session.commitTransaction();
      session.endSession();
  
      return await this.projectModel
        .findById(savedProject._id)
        .populate('users', 'name email');
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
  
      console.error('Erro ao criar projeto:', error);
      throw new HttpException('Erro ao criar projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async removeUserFromProject(projectId: string, userId: string){
    const session = await this.projectModel.db.startSession();
    session.startTransaction();
  
    try {
      const updatedProject = await this.projectModel.findByIdAndUpdate(
        projectId,
        { $pull: { users: userId } },
        { new: true, session }
      );
  
      if (!updatedProject) {
        throw new NotFoundException('Projeto não encontrado');
      }
  
      await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { projects: projectId } },
        { session }
      );
  
      await session.commitTransaction();
      session.endSession();
  
      return await this.projectModel
        .findById(projectId)
        .populate('users', 'name email');
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
  
      console.error('Erro ao remover usuário do projeto:', error);
      throw new HttpException('Erro ao remover usuário do projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findAll(queryFilters: ProjectFiltersDto) {
    try {
      const { search, page = 1, limit = 15, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['title', 'code']);
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        this.projectModel.find({ ...filters, ...searchParams })
          .populate('requests')
          .populate('users', 'name email')
          .skip(skip)
          .limit(limit)
          .exec(),

        this.projectModel.countDocuments({ ...filters, ...searchParams }),
      ]);

      return {
        data: projects,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw new HttpException('Erro ao buscar projetos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectModel.findById(id).populate('requests').populate('users', 'name email');
      if (!project) {
        throw new NotFoundException(`Projeto com id ${id} não encontrado`);
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar projeto:', error);
      throw new HttpException('Erro ao buscar projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findProjectsByUserId(userId: string, queryFilters: RequestFiltersDto): Promise<Project[]> {
    try {
      const { search, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['title', 'code']);
  
      const query: any = {
        users: userId,
        ...filters,
        ...searchParams,
      };
  
      const projects = await this.projectModel
        .find(query)
        .populate('requests')
        .populate('users', 'name email');
  
      return projects;
  
    } catch (error) {
      console.error('Erro ao buscar projetos do usuário:', error);
      throw new HttpException('Erro ao buscar projetos do usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectModel.findByIdAndUpdate(
        { _id: id },
        updateProjectDto,
        { new: true },
      );

      if (!project) {
        throw new NotFoundException(`Projeto com id ${id} não encontrado`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao atualizar projeto:', error);
      throw new HttpException('Erro ao atualizar projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addUsersToProject(projectId: string, userIds: string[]){
    const session = await this.projectModel.db.startSession();
    session.startTransaction();
  
    try {
      const updatedProject = await this.projectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: userIds } } },
        { new: true, session }
      );
  
      if (!updatedProject) {
        throw new NotFoundException('Projeto não encontrado');
      }
  
      await this.userModel.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { projects: projectId } },
        { session }
      );
  
      await session.commitTransaction();
      session.endSession();
  
      return await this.projectModel
        .findById(projectId)
        .populate('users', 'name email')
        .populate('requests');
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
  
      console.error('Erro ao adicionar usuários ao projeto:', error);
      throw new HttpException('Erro ao adicionar usuários ao projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async remove(id: string) {
    try {
      const result = await this.projectModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Projeto com id ${id} não encontrado`);
      }

      return { message: `Projeto com id ${id} removido com sucesso` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao deletar projeto:', error);
      throw new HttpException('Erro ao deletar projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
