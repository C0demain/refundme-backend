import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User, userSchema } from "./user.schema";
import { Expense, ExpenseSchema } from "src/expense/expense.schema";

@Module({
    imports:[MongooseModule.forFeature([{name: User.name, schema: userSchema}, {name: Expense.name, schema: ExpenseSchema}])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule{

}