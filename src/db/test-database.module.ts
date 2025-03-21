import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../user/entities/user.entity';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:', // In-memory database
  entities: [User, Task],
  synchronize: true, // Auto-create tables
  logging: true
});
