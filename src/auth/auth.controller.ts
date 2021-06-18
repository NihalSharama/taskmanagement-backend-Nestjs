import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreadentialsDto } from './dto/auth-creadentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authServise: AuthService) {}
  @Post('/signup')
  signUP(@Body(ValidationPipe) authCreadentialsDto: AuthCreadentialsDto) {
    return this.authServise.signUP(authCreadentialsDto);
  }

  @Post('/login')
  signIN(
    @Body(ValidationPipe) authCreadentialsDto: AuthCreadentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authServise.signIN(authCreadentialsDto);
  }
}
