import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/createExpense.dto';
import { UpdateExpenseDto } from './dtos/updateExpense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ExpenseService {

  private supabase;

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.supabase = createClient(process.env.SUPABASE_URL||"", process.env.SUPABASE_KEY||"");
  }

  async createExpense(createExpenseDto: CreateExpenseDto, file: Express.Multer.File) {
    try {
  
      // Faz o upload apenas se um arquivo foi enviado
      if (file) {
        const { data, error } = await this.supabase
          .storage
          .from(process.env.SUPABASE_BUCKET || "")
          .upload(`receipts/${Date.now()}-${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
          });
  
        if (error) throw error;
        // Obtém a URL pública do arquivo salvo no Supabase
        var imageUrl = this.supabase.storage
          .from(process.env.SUPABASE_BUCKET || "")
          .getPublicUrl(data.path);

      }
      
      // Criar a despesa e salvar no MongoDB
      const expense = new this.expenseModel({
        ...createExpenseDto,
        image: imageUrl.data.publicUrl,
      });
  
      await expense.save();
  
      // Associar a despesa ao usuário
      await this.userModel.findByIdAndUpdate(createExpenseDto.userId, {
        $push: { expenses: expense._id },
      });
  
      return expense;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw new Error('Expense not created');
    }
  }
  

  async getExpenses() {
    try {
      return this.expenseModel.find().exec();
    } catch (error) {
      throw new Error('Expenses not found');
    }
  }

  async getExpenseById(id: string) {
    try {
      return this.expenseModel.findById(id).exec();
    } catch (error) {
      throw new Error('Expense not found');
    }
  }

  async updateExpense(id: string, updateExpense: UpdateExpenseDto) {
    try {
      return this.expenseModel
        .findByIdAndUpdate(id, updateExpense, { new: true })
        .exec();
    } catch (error) {
      throw new Error('Expense not updated');
    }
  }

  async deleteExpense(id: string) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) {
        throw new Error('Expense not found');
      }
  
      // Se a despesa tiver uma imagem, deletá-la do Supabase
      if (expense.image) {
        const filePath = expense.image.split(`${process.env.SUPABASE_BUCKET}/`)[1];
        const { error } = await this.supabase.storage
          .from(process.env.SUPABASE_BUCKET || "")
          .remove([filePath]);
  
        if (error) {
          console.warn('Erro ao deletar imagem do Supabase:', error.message);
        }
      }
  
      // Remover a referência da despesa do usuário
      await this.userModel.updateMany(
        { expenses: id },
        { $pull: { expenses: id } }
      );
  
      // Deletar a despesa do banco
      await this.expenseModel.findByIdAndDelete(id);
  
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      throw new Error('Expense not deleted');
    }
  }
  
}
