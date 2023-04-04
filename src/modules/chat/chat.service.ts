import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class ChatService {
    constructor(@InjectRedis() private readonly redis: Redis) {}
    #clients: Socket[] = []
    
    async addClient(client: Socket): Promise<void> {
        this.#clients.push(client)
        console.log(this.#clients.length)
        const keyRedis = "Сейчас клиентов в чате";
        const valueRedis = this.#clients.length;
        await this.redis.set(keyRedis, valueRedis);
    }
    async removeClient(id: string) {
        this.#clients = this.#clients.filter(client => client.id !== id)
        console.log(this.#clients.length)
        const keyRedis = "Сейчас клиентов в чате";
        const valueRedis = this.#clients.length;
        await this.redis.set(keyRedis, valueRedis);
    }
    getClientId(id: string): Socket  {
        return this.#clients.find(client => client.id === id)
    }
}
