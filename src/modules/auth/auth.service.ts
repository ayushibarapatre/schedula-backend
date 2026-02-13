import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GoogleService } from './google.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async googleLogin(idToken: string, role: string) {
    // 1️⃣ verify google token (dummy now)
    const googleUser =
      await this.googleService.verifyToken(idToken);

    // 2️⃣ find or create user
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        role,
      });
      user = await this.userRepository.save(user);
    }

    // 3️⃣ 🔥 JWT PAYLOAD (MOST IMPORTANT FIX)
    const payload = {
      sub: user.id,          // ✅ REQUIRED
      role: user.role,
      email: user.email,
    };

    const accessToken =
      this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }
}
