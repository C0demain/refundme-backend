import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User, userSchema } from "./user.schema";
import { Expense, ExpenseSchema } from "src/expense/expense.schema";
import { ExpenseService } from "src/expense/expense.service";
import { RequestSchema } from "src/requests/request.schema";
import { Project, ProjectSchema } from "src/projects/project.schema";

@Module({
    imports:[MongooseModule.forFeature([
        {name: User.name, schema: userSchema},
        {name: Expense.name, schema: ExpenseSchema},
        {name: Request.name, schema:RequestSchema},
        { name: Project.name, schema: ProjectSchema }
    ])],
    providers: [UserService, ExpenseService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule{

}