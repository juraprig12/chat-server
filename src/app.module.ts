import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [ChatModule,     
    RedisModule.forRootAsync({
    useFactory: () => ({
      config: { 
        url: 'redis://localhost:6379',
      },
    }),
  }),],
  controllers: [AppController],
  providers: [AppService],                 // Это те сущности, которые обрабатывают бизнес логику в проекте
})
export class AppModule {}
