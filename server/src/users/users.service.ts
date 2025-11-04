import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { GetUserDto } from './dto/get-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Role } from './enum/userEnum';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const { auth: authDto, ...userData } = createUserDto;

    const existingAuth = await this.authRepository.findOne({
      where: { email: authDto.email },
    });

    if (existingAuth) {
      throw new ConflictException('email already exists');
    }

    const existingUsername = await this.usersRepository.findOne({
      where: { username: userData.username },
    });

    if (existingUsername) {
      throw new ConflictException('username already exists');
    }

    const userCount = await this.usersRepository.count();
    const userRole: Role = userCount === 0 ? Role.ADMIN : Role.USER;

    const hashpswd: string = await bcrypt.hash(authDto.password, 12);

    const auth = this.authRepository.create({
      email: authDto.email,
      hash_password: hashpswd,
    });

    const user = this.usersRepository.create({
      ...userData,
      role: userRole,
      auth,
    });

    const savedUser = await this.usersRepository.save(user);

    return plainToInstance(GetUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async UserGetById(id: number): Promise<GetUserDto> {
    const getUser = await this.usersRepository.findOne({
      where: { user_id: id },
    });

    if (!getUser)
      throw new NotFoundException(`User with ID ${id} is not found`);

    return plainToInstance(GetUserDto, getUser, {
      excludeExtraneousValues: true,
    });
  }

  async getUsersData(): Promise<GetUserDto[]> {
    const checkuser = await this.usersRepository.findOne({
      
    })
  }
}
