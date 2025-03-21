// Tasks Service
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private jwtService: JwtService
    
  ) {}

  async create(createTaskDto: any, userId: string) {
    const task = this.tasksRepository.create({ ...createTaskDto, user: { id: userId } });
    return await this.tasksRepository.save(task);
  }

  async findAll(userId: string) {
    return await this.tasksRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: string, updateTaskDto: any, userId: string) {

    console.log(id)
    
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.id !== userId) throw new ForbiddenException('Access denied');
    await this.tasksRepository.update(id, updateTaskDto);
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async remove(id: string, userId: string) {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.id !== userId) throw new ForbiddenException('Access denied');
    await this.tasksRepository.delete(id);
    return { message: 'Task deleted successfully' };
  }
}