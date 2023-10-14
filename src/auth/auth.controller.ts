import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, Public } from '../common/decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  @ApiOperation({
    summary: 'this is the login API',
  })
  @Public()
  async login(@Body() dto: RegisterUserDTO) {
    return await this.authService.login(dto);
  }
  @Post('register')
  @ApiOperation({
    summary: 'this is the sign up API',
  })
  @Public()
  async register(@Body() dto: RegisterUserDTO) {
    return await this.authService.create(dto);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'This is the profile endpoint',
  })
  @HttpCode(HttpStatus.OK)
  async profile(@GetUser() user: any) {
    return this.authService.getUserById(user);
  }
}
