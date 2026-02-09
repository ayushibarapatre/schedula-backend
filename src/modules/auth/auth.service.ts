import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { GoogleService } from './google.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async googleLogin(data: any) {
    const { idToken, role } = data;

    // 🔹 1. Role validation (basic safety)
    if (!role || !['PATIENT', 'DOCTOR'].includes(role)) {
      throw new UnauthorizedException('Invalid role');
    }

    // 🔹 2. Verify Google token
    const googleUser = await this.googleService.verifyIdToken(idToken);
    if (!googleUser) {
      throw new UnauthorizedException('Invalid Google token');
    }

    // 🔹 3. Find user in DB
    let user = await this.userRepo.findOne({
      where: { email: googleUser.email },
    });

    // 🔹 4. Create user if not exists
    if (!user) {
      user = this.userRepo.create({
        email: googleUser.email,
        name: googleUser.name,
        role,
      });

      await this.userRepo.save(user);
    }

    // 🔹 5. Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    // 🔹 6. Final response
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}
