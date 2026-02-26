import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  async verifyToken(token: string) {
    // dummy implementation (as per your project)
    return {
      email: 'test@gmail.com',
      name: 'Test User',
    };
  }
}
