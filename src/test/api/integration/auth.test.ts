import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../auth/auth.controller';
import { AuthService } from '../../../auth/auth.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';

import { JwtModule, JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { LocalAuthGuard } from '../../../auth/local-auth.guard';
import { Task } from 'src/tasks/entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

describe('AuthTest', () => {
  //  Integration Tests: Authentication endpoints
  let authService:AuthService;
  let userService:UserService;
  let userRepo:Repository<User>;

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
            synchronize: true, // ✅ Auto-create tables
            // logging: true, // ✅ Log SQL queries
          }),
          TypeOrmModule.forFeature([User]), // ✅ Register Task entity for repository
          JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
          }),
        ],
      controllers: [AuthController],
      
      providers: [
       AuthService,
        UserService
       
      ],
    }).compile(); // 👈 Mock the LocalAuthGuard
    

    // app = module.createNestApplication();
    // await app.init();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    
  },10000);

  afterAll(async () => {
    const users = await userService.findAll();
    console.log('Current Users in DB:', users); // Logs current DB state
    // await userService['userRepository'].query(
    //   `DELETE FROM "user" WHERE email = 'test@example.com'`
      
    // );  
    // const user = users.filter((user)=>user.email == 'test@example.com')
    // // const response = await authService.login({email:'test@example.com',password:'password123'})
    // console.log("User",user)  
  },10000);
  // Register route
  // it('POST /auth/register - should register a user', async () => {
  //   const response = await authService.register('test@example.com','password123')
  //   console.log(response)   
  // });
  // Login route
  it('POST /auth/login - should return a JWT token', async () => {
    const response = await authService.login({email:'test@example.com',password:'password123'})
    console.log(response)  
  },10000);
  // // Logout route
  it('POST /auth/logout - should log out a user', async () => {
    const response = await authService.logout()
    console.log(response)  
  },10000);

  // MISSING EDGDE CASE: 
});
