import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'local' }), // 👈 Ensures Passport is initialized
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'd0cvn28bmd41ueiqd8a#023n9da89&',
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([User]),
    

  ],
  providers: [AuthService], // 👈 Ensure LocalStrategy is in providers
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // 👈 Ensure AuthService is available for DI
})
export class AuthModule {}
