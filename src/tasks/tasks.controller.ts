// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { TasksService } from './tasks.service';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';

// @Controller('tasks')
// export class TasksController {
//   constructor(private readonly tasksService: TasksService) {}

//   @Post()
//   create(@Body() createTaskDto: CreateTaskDto) {
//     return this.tasksService.create(createTaskDto);
//   }

//   @Get()
//   findAll() {
//     return this.tasksService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.tasksService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
//     return this.tasksService.update(+id, updateTaskDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.tasksService.remove(+id);
//   }
// }
// Tasks Controller
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createTaskDto, @Request() req) {
    // return this.tasksService.create(createTaskDto, req.userId);
    console.log("request",req.body.userId)
    return this.tasksService.create(createTaskDto, req.body.userId);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query('userId') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Patch(':id/user/:userId')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateTaskDto, @Param('userId') userId: string, ) {


    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id/user/:userId')
  @HttpCode(200)
  remove(@Param('id') id: string, @Param('userId') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}