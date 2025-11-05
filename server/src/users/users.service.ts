import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsersData(): Promise<GetUserDto[]> {
    const users = await this.usersRepository.find({ relations: ['auth'] });
    return users.map((user) =>
      plainToInstance(GetUserDto, user, { excludeExtraneousValues: true }),
    );
  }

  async getUserById(id: number): Promise<GetUserDto> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['auth'],
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return plainToInstance(GetUserDto, user, { excludeExtraneousValues: true });
  }

  async updateUserById(id: number, dto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['auth'],
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    Object.assign(user, dto);
    const updated = await this.usersRepository.save(user);

    return plainToInstance(GetUserDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['auth'],
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.usersRepository.remove(user);

    return { message: `User with ID ${id} has been deleted` };
  }
}
