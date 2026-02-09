import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
    ProfileController, // ✅ STEP 10.3 controller
  ],
  providers: [
    AuthService,
    GoogleService,
    JwtStrategy, // ✅ STEP 10.1 strategy
  ],
})
export class AuthModule {}
