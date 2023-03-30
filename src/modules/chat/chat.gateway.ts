import { ClientToServerListen, ServerToClientListen } from './types/WebSocketListen';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from './chat.service';
import { Message } from './types/Message';
import { AppController } from 'src/app.controller';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*'
  }
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService, private app: AppController) { }

  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: Message): Promise<void> {
    const keyRedis =message.username;
    const valueRedis = message.message; 
    this.app.setRedis(keyRedis, valueRedis);
    console.table(message)
    this.server.emit('message', message)
  }

  @SubscribeMessage('countMessage')
  async handleCountMessage(@MessageBody() message: Message) {
    const keyRedis =message.username + ':' + message.date;
    message.countMessage = await this.app.getRedis(keyRedis);
    console.table(message)
    this.server.emit('message', message)
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    if (!this.chatService.getClientId(client.id)) this.chatService.addClient(client)
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.chatService.removeClient(client.id)
    client.disconnect(true)
  }
}