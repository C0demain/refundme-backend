import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/user/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProjectFiltersDto } from 'src/projects/dto/project-filters.dto';
import { RequestFiltersDto } from 'src/requests/dto/request-filters.dto';
import { AddUsersToProjectDto } from './dto/addUsersToProject.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() filters: ProjectFiltersDto) {
    return this.projectsService.findAll(filters);
  }

  @Get('user/:userId')
  async getProjectsByUserId(@Param('userId') userId: string, @Query() filters: RequestFiltersDto) {
    return await this.projectsService.findProjectsByUserId(userId, filters);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':projectId/users')
  async addUsersToProject(@Param('projectId') projectId: string,@Body() body: AddUsersToProjectDto) {
    return this.projectsService.addUsersToProject(projectId, body.userIds );
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Delete(':projectId/users/:userId')
  removeUserFromProject(@Param('projectId') projectId: string,@Param('userId') userId: string) {
    return this.projectsService.removeUserFromProject(projectId, userId);
  }

}
