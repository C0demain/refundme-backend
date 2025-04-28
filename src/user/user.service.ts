import { Injectable, NotFoundException, HttpException, HttpStatus, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { UserFiltersDto } from "src/user/dtos/user-filters.dto";
import parseSearch from "src/utils/parseSearch";
import { Request } from "src/requests/request.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Request.name) private readonly requestModel: Model<Request>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.userModel.findOne({ email: createUserDto.email });
      if (emailExists) {
        throw new ConflictException('Já existe um usuário com esse e-mail');
      }
  
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      if (error instanceof HttpException) throw error;
  
      console.error('Erro interno ao criar usuário:', error);
      throw new HttpException('Erro interno ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async getUsers(queryFilters: UserFiltersDto) {
    try {
      const { search, ...filters } = queryFilters;
      const searchParams = parseSearch(search, ['name', 'email']);

      return await this.userModel.find({ ...filters, ...searchParams }).populate('requests').populate('projects').exec();
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new HttpException('Erro ao buscar usuários', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id).populate('requests').exec();

      if (!user) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar usuário por ID:', error);
      throw new HttpException('Erro ao buscar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).populate('requests').exec();

      if (!user) {
        throw new NotFoundException(`Usuário com email ${email} não encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar usuário por email:', error);
      throw new HttpException('Erro ao buscar usuário por email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUser, { new: true }).exec();

      if (!updatedUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao atualizar usuário:', error);
      throw new HttpException('Erro ao atualizar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      return { message: `Usuário com id ${id} removido com sucesso` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao deletar usuário:', error);
      throw new HttpException('Erro ao deletar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
