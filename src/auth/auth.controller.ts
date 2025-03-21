// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post()
//   create(@Body() createAuthDto: CreateAuthDto) {
//     return this.authService.create(createAuthDto);
//   }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
// }

// Auth Controller
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() body) {
    return await this.authService.register(body.email, body.password);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return await this.authService.login(req.body.user);
  }
  // @UseGuards(LocalAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    return await this.authService.logout();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  async getProfile(@Request() req) {
    return req.user;
  }
}