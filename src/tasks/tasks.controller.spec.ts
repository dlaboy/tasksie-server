import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('TasksController (e2e)', () => {
  let controller: TasksController;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [TasksController],
        providers: [TasksService,JwtService],
      }).compile();
  
      controller = module.get<TasksController>(TasksController);
    });
  
    
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    let app: INestApplication;

      beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
          // imports: [TestDatabaseModule, TypeOrmModule.forFeature([User])], // Use in-memory DB
          controllers: [TasksController],
          providers: [TasksService],
        }).compile();
    
        app = module.createNestApplication();
        await app.init();
      });
    
      afterAll(async () => {
        await app.close();
      });
    
  // let app: INestApplication;
  // let tasksService = {
  //   create: jest.fn(),
  //   findAll: jest.fn(),
  //   update: jest.fn(),
  //   remove: jest.fn(),
  // };

  // beforeAll(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [TasksController],
  //     providers: [
  //       {
  //         provide: TasksService,
  //         useValue: tasksService,
  //       },
  //       {
  //         provide: getRepositoryToken(Task),
  //         useValue: {},
  //       },
  //     ],
  //   })
  //     .overrideGuard(JwtAuthGuard) // 👈 Mock Authentication Guard
  //     .useValue({ canActivate: jest.fn(() => true) })
  //     .compile();

  //   app = module.createNestApplication();
  //   await app.init();
  // });

  // afterAll(async () => {
  //   await app.close();
  // });

  // 🟢 CREATE TASK
  // it('POST /tasks - should create a new task', async () => {
  //   const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' , userId:1};
  //   tasksService.create.mockResolvedValue(mockTask);

  //   await request(app.getHttpServer())
  //     .post('/tasks')
  //     .send({title: 'Test Task', description: 'Test Description' , userId:1})
  //     .expect(200) // ✅ Expect 200 OK
  //     .expect(mockTask);
  // });

  // 🟢 GET ALL TASKS
  // it('GET /tasks - should return all tasks', async () => {
  //   const mockTasks = [{ id: 1, title: 'Test Task 1' ,userId:1}];
  //   tasksService.findAll.mockResolvedValue(mockTasks);

  //   await request(app.getHttpServer())
  //     .get('/tasks')
  //     .expect(200) // ✅ Expect 200 OK
  //     .expect(mockTasks);
  // });

  // 🟢 UPDATE TASK
  // it('PATCH /tasks/:id - should update a task', async () => {
  //   const updatedTask = { id: 1, title: 'Updated Task', description: 'Updated Description' ,userId:1};
  //   tasksService.update.mockResolvedValue(updatedTask);

  //   await request(app.getHttpServer())
  //     .patch('/tasks/1')
  //     .send({ title: 'Updated Task', description: 'Updated Description' })
  //     .expect(200) // ✅ Expect 200 OK
  //     .expect(updatedTask);
  // });

  // 🟢 DELETE TASK
  // it('DELETE /tasks/:id - should delete a task', async () => {
  //   tasksService.remove.mockResolvedValue({ message: 'Task deleted' });

  //   await request(app.getHttpServer())
  //     .delete('/tasks/1')
  //     .expect(200) // ✅ Expect 200 OK
  //     .expect({ message: 'Task deleted' });
  // });
});
