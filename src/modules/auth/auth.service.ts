import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
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
    // 1️⃣ Verify Google token
    const googleUser =
      await this.googleService.verifyToken(idToken);

    // 2️⃣ Find user by email
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    // 3️⃣ If user already exists → ROLE CHECK ⭐
    if (user) {
      if (user.role !== role) {
        throw new BadRequestException(
          `You are already registered as a ${user.role}.
You cannot log in as a ${role}.
Please use a different email.`,
        );
      }
    }

    // 4️⃣ First time login → create user
    if (!user) {
      user = this.userRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        role, // role set ONLY once
      });

      user = await this.userRepository.save(user);
    }

    // 5️⃣ JWT payload
    const payload = {
      sub: user.id,
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