import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
  
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
        exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
        exception instanceof HttpException ? exception.getResponse() : null;

        const message =
        typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse?.['message'] || 'Erro interno no servidor';

        const errors = Array.isArray(message) ? message : [message];

        response.status(status).json({
        statusCode: status,
        message: this.mapStatusToMessage(status),
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
        });
    }

    private mapStatusToMessage(status: number): string {
        switch (status) {
        case 400:
            return 'Requisição inválida';
        case 401:
            return 'Não autorizado';
        case 403:
            return 'Acesso negado';
        case 404:
            return 'Recurso não encontrado';
        case 409:
            return 'Conflito de dados';
        default:
            return 'Erro interno no servidor';
        }
    }
}
