import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user

    console.log(userId)
    next()
  }
}

// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { PrismaService } from './prisma.service';

// @Injectable()
// export class AdminMiddleware implements NestMiddleware {
//   constructor(private prisma: PrismaService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const userId = req.user.id; // Supondo que você tenha definido o usuário no middleware de autenticação

//     // Consulta o usuário no banco de dados para verificar a função de administrador
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: { role: true }
//     });

//     if (!user || user.role !== 'ADMIN') {
//       throw new UnauthorizedException('Você não tem permissão para realizar esta operação.');
//     }

//     next();
//   }
// }
