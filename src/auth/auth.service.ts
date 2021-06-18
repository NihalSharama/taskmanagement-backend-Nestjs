import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCreadentialsDto } from './dto/auth-creadentials.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUP(authCreadentialsDto: AuthCreadentialsDto): Promise<void> {
    return this.userRepository.signUP(authCreadentialsDto);
  }

  async signIN(
    authCreadentialsDto: AuthCreadentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validatePassword(
      authCreadentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credendials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT token with payload: ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
