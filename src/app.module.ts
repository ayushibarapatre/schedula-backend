import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',              // 👈 TEMP for local
        database: 'db.sqlite',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    SlotsModule, // 🔥 THIS WAS THE MISSING PIECE
  ],
})
export class AppModule {}
