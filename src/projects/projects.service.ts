import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectFiltersDto } from 'src/projects/dto/project-filters.dto';
import parseSearch from 'src/utils/parseSearch';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = new this.projectModel(createProjectDto);
      return await project.save();
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw new HttpException('Erro ao criar projeto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(queryFilters: ProjectFiltersDto) {
    try {
      const { search, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['title', 'code']);

      return await this.projectModel.find({
        ...filters,
        ...searchParams,
      }).populate('requests');
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw new HttpException('Erro ao buscar projetos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectModel.findById(id);
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
