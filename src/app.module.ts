import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { RequestsModule } from './requests/requests.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI_ATLAS || ''),
    UserModule,
    AuthModule,
    ExpenseModule,
    ProjectsModule,
    RequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
