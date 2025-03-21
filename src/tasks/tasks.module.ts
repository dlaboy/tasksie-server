import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), 
    AuthModule,
      JwtModule.register({
          secret: process.env.JWT_SECRET || 'd0cvn28bmd41ueiqd8a#023n9da89&',
          signOptions: { expiresIn: '60m' },
        }),
  ], // ✅ Register Task entity for repository

  controllers: [TasksController],
  providers: [TasksService],

})
export class TasksModule {}
