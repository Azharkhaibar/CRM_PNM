import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
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

  async getUserById(user_id: number): Promise<GetUserDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id },
        relations: ['auth'],
      });

      if (!user)
        throw new NotFoundException(`User with ID ${user_id} not found`);

      return plainToInstance(GetUserDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async updateUserById(
    user_id: number,
    dto: UpdateUserDto,
  ): Promise<GetUserDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id },
      });

      if (!user)
        throw new NotFoundException(`User with ID ${user_id} not found`);

      Object.assign(user, dto);
      const updated = await this.usersRepository.save(user);

      return plainToInstance(GetUserDto, updated, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUserById(user_id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id },
      });

      if (!user)
        throw new NotFoundException(`User with ID ${user_id} not found`);

      await this.usersRepository.remove(user);

      return { message: `User with ID ${user_id} has been deleted` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async changePassword(
    userID: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const auth = await this.AuthRepository.findOne({
        where: { userID },
        relations: ['user'],
      });

      if (!auth) {
        throw new NotFoundException('User not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        auth.hash_password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      auth.hash_password = hashedNewPassword;
      await this.AuthRepository.save(auth);

      return {
        message: 'Password changed successfully',
        userID: auth.userID,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async requestPasswordReset(userID: string) {
    try {
      const auth = await this.AuthRepository.findOne({
        where: { userID },
        relations: ['user'],
      });

      if (!auth) {
        // Return generic message for security
        return {
          message:
            'If your user ID exists, a password reset link has been sent to your registered email',
        };
      }

      // TODO: Implement actual password reset logic:
      // 1. Generate reset token
      // const resetToken = crypto.randomBytes(32).toString('hex');
      // const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // 2. Save token to user/auth entity
      // auth.resetToken = resetToken;
      // auth.resetTokenExpiry = resetTokenExpiry;
      // await this.AuthRepository.save(auth);

      // 3. Send email with reset link
      // await this.emailService.sendPasswordResetEmail(auth.user.email, resetToken);

      // For now, return success message
      return {
        message:
          'If your user ID exists, a password reset link has been sent to your registered email',
        userID: auth.userID,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'Failed to process password reset request',
        );
      }
    }
  }
}
