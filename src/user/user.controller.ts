import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "./enums/role.enum";
import { RolesGuard } from "src/auth/guards/role.guard";
import { UserFiltersDto } from "src/user/dtos/user-filters.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getUsers(@Query() filters: UserFiltersDto) {
    return this.userService.getUsers(filters);
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
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('User not found', 404);
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
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
