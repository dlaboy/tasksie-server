import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../../tasks/tasks.controller';
import { TasksService } from '../../../tasks/tasks.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../../tasks/entities/task.entity';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource, getConnection } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

describe('TasksController (e2e)', () => {
    let authService:AuthService;
    let userService:UserService;
    let tasksService:TasksService;
    let taskIdtoUpdate:string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
                TypeOrmModule.forRoot({
                  type: 'postgres',
                  host: process.env.DB_HOST,
                  port: Number(process.env.DB_PORT),
                  username: process.env.DB_USER,
                  password: String(process.env.DB_PASS),
                  database: process.env.DB_NAME,
                  entities: [Task, User],
                  synchronize: true, 
                }),
                TypeOrmModule.forFeature([Task,User]), 
                JwtModule.register({
                  secret: process.env.JWT_SECRET,
                  signOptions: { expiresIn: '1h' },
                }),
              ],
      controllers: [TasksController, AuthController,UserController],
      providers: [
        TasksService,
        AuthService,
        UserService
      ],
    })
      .compile();
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tasksService = module.get<TasksService>(TasksService);
    taskIdtoUpdate = ''




  },10000);


// DELETE TASK`
  afterAll(async () => {
        const users = await userService.findAll();
        const user = users.filter((user)=>user.email == 'test@example.com')
        console.log("User",user[0].id)  
        const id = String(user[0].id)

        await tasksService['tasksRepository'].query(
        `DELETE FROM "task" WHERE "userId"=$1 AND "id"=$2` ,[id,taskIdtoUpdate]
        
        );  
},10000);
it('POST /register - should create a new user', async () => {  
  const response = await authService.register('test@example.com','password123')
  console.log(response) 
},10000);

  // CREATE TASK
  it('POST /tasks - should create a new task', async () => {  
    console.log("POST TASK")
    const users = await userService.findAll();
    const user = users.filter((user)=>user.email == 'test@example.com')
    console.log("User",user[0].id)  
    const taskRequest = await tasksService.create({title:"Test task",description:"This is a test task"},user[0].id)
    console.log(taskRequest)
    const taskRequest2 = await tasksService.create({title:"Test task 2",description:"This is a test task 2"},user[0].id)
    console.log(taskRequest2)
  },10000);

  // // GET ALL TASKS
  it('GET /tasks - should return all tasks', async () => {
    console.log("GET ALL TASK")
    const users = await userService.findAll();
    const user = users.filter((user)=>user.email == 'test@example.com')
    console.log("User",user[0].id)  
    const taskRequest = await tasksService.findAll(user[0].id)
    console.log(taskRequest[0].id)
    taskIdtoUpdate = taskRequest[0].id
  },10000);

  // UPDATE TASK
  it('PATCH /tasks/:id/user/:userId - should update a task', async () => {
    console.log("UPDATE TASK")
    const users = await userService.findAll();
    const user = users.filter((user)=>user.email == 'test@example.com')
    console.log("User",user[0].id)  
    const updatedTask ={
        title:"Updated Task",
        description:"This is an updated task"
    } 

    const response = await tasksService.update(taskIdtoUpdate,updatedTask,user[0].id)

    console.log(response)
   
  },10000);

 
  
});
