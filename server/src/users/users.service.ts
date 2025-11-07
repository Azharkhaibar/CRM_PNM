import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register-user.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly AuthRepository: Repository<Auth>,
  ) {}

  async register(dto: RegisterDto) {
    const { userID, password, role, gender } = dto;

    const exists = await this.AuthRepository.findOne({
      where: { userID },
    });

    if (exists) throw new BadRequestException('User ID Already registered');

    const hash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      userID,
      role,
      gender,
    });
    await this.usersRepository.save(user);

    const auth = this.AuthRepository.create({
      userID,
      hash_password: hash,
      user,
    });

    return this.AuthRepository.save(auth);
  }

  async getUsersData(): Promise<GetUserDto[]> {
    try {
      const users = await this.usersRepository.find({ relations: ['auth'] });
      return users.map((user) =>
        plainToInstance(GetUserDto, user, { excludeExtraneousValues: true }),
      );
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch users data');
    }
  }

  async getUserById(id: number): Promise<GetUserDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: id },
        relations: ['auth'],
      });

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return plainToInstance(GetUserDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async updateUserById(id: number, dto: UpdateUserDto): Promise<GetUserDto> {
    try {
      if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestException('Tidak ada data untuk diupdate');
      }

      const user = await this.usersRepository.findOne({
        where: { user_id: id },
        relations: ['auth'],
      });

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      Object.assign(user, dto); // merge perubahan
      const updated = await this.usersRepository.save(user);

      return plainToInstance(GetUserDto, updated, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: id },
        relations: ['auth'],
      });

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      await this.usersRepository.remove(user);

      return { message: `User with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
