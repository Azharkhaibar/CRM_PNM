import { AppDataSource } from '../config/data-source';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Role, Gender } from '../users/enum/userEnum';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const authRepo = AppDataSource.getRepository(Auth);

  const passwordHash = await bcrypt.hash('RIMSPNM', 12);

  const user = userRepo.create({
    userID: 'GAS-10',
    role: Role.USER,
    gender: Gender.MALE,
  });
  const savedUser = await userRepo.save(user);
  const auth = authRepo.create({
    userID: 'GAS-20',
    hash_password: passwordHash,
    user: savedUser,
  });

  await authRepo.save(auth);

  console.log('Seeding done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
