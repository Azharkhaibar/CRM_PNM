import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<GetUserDto[]> {
    return this.usersService.getUsersData();
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetUserDto> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return this.usersService.updateUserById(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserById(id);
  }
}
