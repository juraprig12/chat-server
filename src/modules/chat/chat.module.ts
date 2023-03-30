import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [ChatGateway, ChatService, AppController, AppService],  // Это те сущности, которые обрабатывают бизнес логику в проекте
  controllers: [AppController]
})
export class ChatModule {}
