import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './request.schema';
import { Project, ProjectSchema } from 'src/projects/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
