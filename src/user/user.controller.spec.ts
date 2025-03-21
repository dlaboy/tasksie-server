import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDatabaseModule } from 'src/db/test-database.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User } from './entities/user.entity';


describe('UserController (e2e)', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [TestDatabaseModule, TypeOrmModule.forFeature([User])], // Use in-memory DB
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('POST /api/user - should create a user', async () => {
  //   await request(app.getHttpServer())
  //     .post('/api/users')
  //     .send({ email: 'laboydiego23@gmail.com',password:'LABOY2001'})
  //     .expect(201);
  // });

  // it('GET /api/user - should return all users', async () => {
  //   await request(app.getHttpServer()).get('/api/user').expect(200);
  // });
});

