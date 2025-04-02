import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { ExpenseService } from "src/expense/expense.service";


@Injectable()
export class UserService{
    constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly expenseService:ExpenseService){}
    
    async createUser(createUserDto: CreateUserDto){
        const newUser = new this.userModel(createUserDto);

        return newUser.save()
    }

    async getUsers(){
        return this.userModel.find().exec();
    }

    async getUsersWithExpenses(){
        const users = await this.userModel.find().populate('expenses').lean().exec();

        return Promise.all(users.map(async user => ({
            ...user,
            expenses: await Promise.all(user.expenses.map(async (expense: any) => ({
                ...expense,
                image: expense.image ? await this.expenseService.getSignedImageUrl(expense.image) : null,
            }))),
        })));
    }
    
    async getUserById(id: string){
        return this.userModel.findById(id).populate('expenses').exec();
    }

    async getUserByEmail(email: string){
        return this.userModel.findOne({email}).exec()
    }
    
    async updateUser(id: string, updateUser: UpdateUserDto){
        return this.userModel.findByIdAndUpdate(id, updateUser,{new: true}).exec();
    }

    async deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}