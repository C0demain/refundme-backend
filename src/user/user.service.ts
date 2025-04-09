import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { UserFiltersDto } from "src/user/dtos/user-filters.dto";
import parseSearch from "src/utils/parseSearch";


@Injectable()
export class UserService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Request.name) private readonly requestModel: Model<Request>
    ){}
    
    async createUser(createUserDto: CreateUserDto){
        const newUser = new this.userModel(createUserDto);

        return newUser.save()
    }

    async getUsers(queryFilters: UserFiltersDto){
        const {search, ...filters} = queryFilters
        const searchParams = parseSearch(search, ['name', 'email'])
        
        return this.userModel.find( {...filters, ...searchParams} ).exec();
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