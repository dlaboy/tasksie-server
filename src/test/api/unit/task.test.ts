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

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let tasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  let dataSource: DataSource;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', 
          entities: [Task, User],
          synchronize: true, 
        }),
        TypeOrmModule.forFeature([Task]), 
      ],
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: tasksService,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock Authentication Guard
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get<DataSource>(DataSource);

  });

  afterAll(async () => {
    await app.close();
  });

  // CREATE TASK
  it('POST /tasks - should create a new task', async () => {
    const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' , userId:1};
    tasksService.create.mockResolvedValue(mockTask);

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({title: 'Test Task', description: 'Test Description' , userId:1})
      .expect(200) // Expect 200 OK
    .expect(mockTask);
    const tasks = await dataSource.getRepository(Task).find();

    console.log(response.statusCode)
    console.log('Current Tasks in DB:', tasks); // Logs current DB state
  });

  // GET ALL TASKS
  it('GET /tasks - should return all tasks', async () => {
    const mockTasks = [{ id: 1, title: 'Test Task 1' ,userId:1}];
    tasksService.findAll.mockResolvedValue(mockTasks);

    await request(app.getHttpServer())
      .get('/tasks')
      .expect(200) // Expect 200 OK
      .expect(mockTasks);
  });

  // UPDATE TASK
  it('PATCH /tasks/:id/user/:userId - should update a task', async () => {
    const updatedTask = { id: 1, title: 'Updated Task', description: 'Updated Description' ,userId:1};
    tasksService.update.mockResolvedValue(updatedTask);

    await request(app.getHttpServer())
      .patch('/tasks/1/user/1')
      .send({ title: 'Updated Task', description: 'Updated Description' })
      .expect(200) // Expect 200 OK
      .expect(updatedTask);
  });

  // DELETE TASK
  it('DELETE /tasks/:id/user/:userId - should delete a task', async () => {
    tasksService.remove.mockResolvedValue({ message: 'Task deleted' });

    await request(app.getHttpServer())
      .delete('/tasks/1/user/1')
      .expect(200) // Expect 200 OK
      .expect({ message: 'Task deleted' });
  });  
});
