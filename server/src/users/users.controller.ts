import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() CreateUserDto: CreateUserDto) {
    const created = await this.usersService.register(CreateUserDto);
    return {
      message: 'User registered successfully',
      data: created,
    };
  }
  // get data users
  // @Get()
  // async getDataUser(@Body() GetUserDto: CreateUserDto) {
  //   const checkUser = await this.usersService.
  // } 
}
