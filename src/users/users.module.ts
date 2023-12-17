import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from './../prisma.service';
import { AuthModule } from './../auth/auth.module'; 
import { JwtModule } from '@nestjs/jwt'; 
@Module({
  imports: [AuthModule,JwtModule ], // Include AuthModule here
  controllers: [UsersController],
  providers: [UsersService,PrismaService],
})
export class UsersModule {}
