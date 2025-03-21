import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    Param, 
    Patch, 
    Post, 
    UseGuards
  } from "@nestjs/common";
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
  import { UserService } from "./user.service";
  import mongoose from "mongoose";
  import { CreateUserDto } from "./dtos/createUser.dto";
  import { UpdateUserDto } from "./dtos/updateUser.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
  
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(private userService: UserService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async getUsers() {
      return this.userService.getUsers();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string) {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('User not found', 404);
      const findUser = await this.userService.getUserById(id);
      if (!findUser) throw new HttpException('User not found', 404);
      return findUser;
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBody({ type: UpdateUserDto})
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('User not found', 404);
      return this.userService.updateUser(id, updateUserDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id') id: string) {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('User not found', 404);
      const deletedUser = this.userService.deleteUser(id);
      if (!deletedUser) throw new HttpException('User not found', 404);
      return deletedUser;
    }
  }
  