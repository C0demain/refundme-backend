
import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";

@Controller('users')
export class UserController{

    constructor(private userService: UserService){}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.createUser(createUserDto);
    }

    @Get()
    getUsers(){
        return this.userService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id')id: string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('user not found', 404);
        const findUser = await this.userService.getUserById(id);
        if(!findUser) throw new HttpException('user not found', 404);
        return findUser;
    }

    @Patch(':id')
    async updateUser(@Body()updateUserDto: UpdateUserDto, @Param('id') id:string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('user not found', 404);
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('user not found', 404);
        const deletedUser = this.userService.deleteUser(id);
        if(!deletedUser) throw new HttpException('user not found', 404);
        return deletedUser;
    
    }

}
