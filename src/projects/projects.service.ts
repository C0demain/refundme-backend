import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { ProjectFiltersDto } from 'src/projects/dto/project-filters.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = new this.projectModel(createProjectDto);
    return project.save();
  }

  async findAll(filters: ProjectFiltersDto) {
    return await this.projectModel.find(filters);
  }

  async findOne(id: string) {
    return await this.projectModel.findById(id);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectModel.findByIdAndUpdate(
      { _id: id },
      updateProjectDto,
      { new: true },
    );
  }

  async remove(id: string) {
    await this.projectModel.deleteOne({ _id: id }).exec();
    return { message: `Project with ${id} was removed` };
  }
}
