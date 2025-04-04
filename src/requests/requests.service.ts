import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './request.schema';
import { Project } from 'src/projects/project.schema';
import { RequestFiltersDto } from 'src/requests/dto/request-filters.dto';
import parseSearch from 'src/utils/parseSearch';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = new this.requestModel({
      ...createRequestDto,
      project: createRequestDto.projectId,
    });

    const project = await this.projectModel.findById(
      createRequestDto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.requests.push(request._id);
    await project.save();
    
    return request.save();
  }

  async findAll(queryFilters: RequestFiltersDto) {
    const { search, ...filters } = queryFilters;
    const searchParams = parseSearch(search, ['title', 'code']);

    return await this.requestModel.find({
      ...filters,
      ...searchParams,
    });
  }

  async findOne(id: string) {
    return await this.requestModel.findById(id);
  }

  async update(id: string, projectRequestData: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(
      { _id: id },
      projectRequestData,
      { new: true },
    );
  }

  async remove(id: string) {
    await this.requestModel.deleteOne({ _id: id }).exec();
    return `Project with ${id} was removed`;
  }
}
