import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport"
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './../prisma.service';
import { UsersService } from './../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/constants';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  
  controllers: [AuthController],
  providers: [AuthService,UsersService,PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
