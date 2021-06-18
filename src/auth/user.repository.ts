import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCreadentialsDto } from './dto/auth-creadentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUP(authCreadentialsDto: AuthCreadentialsDto): Promise<void> {
    const { username, password } = authCreadentialsDto;

    const user = new User();
    user.username = username;
    user.namak = await bcrypt.genSalt(); // Lmao naming :)
    user.password = await this.HashGen(password, user.namak);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already taken (TT__TT)');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(
    authCreadentialsDto: AuthCreadentialsDto,
  ): Promise<string> {
    const { username, password } = authCreadentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async HashGen(password: string, namak: string): Promise<string> {
    return bcrypt.hash(password, namak);
  }
}
