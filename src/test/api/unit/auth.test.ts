import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../auth/auth.controller';
import { AuthService } from '../../../auth/auth.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { LocalAuthGuard } from '../../../auth/local-auth.guard';
import { Task } from 'src/tasks/entities/task.entity';
import { DataSource, Repository } from 'typeorm';

describe('AuthTest', () => {
  // let controller: AuthController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AuthController],
  //     providers: [
  //       AuthService,
  //       JwtService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useValue: {
  //           findOne: jest.fn(),
  //           save: jest.fn(),
  //         },
  //       },
  //     ],
  //   }).compile();

  //   controller = module.get<AuthController>(AuthController);
  // });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });



  // Unit tests: Authentication endpoints
  let app: INestApplication;
  let authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };
  let dataSource: DataSource;
  let userRepo: Repository<User>;

  

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:', // ✅ In-Memory Database
            entities: [Task, User],
            synchronize: true, // ✅ Auto-create tables
            // logging: true, // ✅ Log SQL queries
          }),
          TypeOrmModule.forFeature([User]), // ✅ Register Task entity for repository
        ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked-jwt-token'),
            // verify: jest.fn(() => ({ userId: 1 })),
          },
        },
      ],
    }).overrideGuard(LocalAuthGuard) // 👈 Mock the LocalAuthGuard
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get<DataSource>(DataSource);
    userRepo = dataSource.getRepository(User)
    
  });

  afterAll(async () => {
    await app.close();
  });
  // Register route
  it('POST /auth/register - should register a user', async () => {
    authService.register.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect({ id: 1, email: 'test@example.com' });
  

    console.log(response.statusCode)
    const users = await userRepo.find();

    console.log('Current Users in DB:', users); // Logs current DB state

    // expect(users.length).toBe(1);
    // expect(users[0].email).toBe('test@example.com');
    
  });
  // Login route
  it('POST /auth/login - should return a JWT token', async () => {
    authService.login.mockResolvedValue({ access_token: 'mocked-jwt-token' });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect({ access_token: 'mocked-jwt-token' });
  });
  // // Logout route
  it('POST /auth/logout - should log out a user', async () => {
    authService.logout.mockResolvedValue({ message: 'Logged out' });

    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200)
      .expect({ message: 'Logged out' });
  });

  // MISSING EDGDE CASE: 
});
