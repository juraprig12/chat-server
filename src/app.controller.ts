import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService, @InjectRedis() private readonly redis: Redis) {}

  async getRedis(@Body() inputRedisKey: string) {
    let redisResult = await this.redis.get(inputRedisKey);
    return redisResult
  }

  async setRedis(@Body() inputKeyRedis: string, inputValueRedis: string) {
    let date = new Date();
    let keyRedis = inputKeyRedis + ':' + date.toLocaleDateString();
    let valueRedis = Number(await this.redis.get(keyRedis)) + 1;
    await this.redis.set(keyRedis, valueRedis);
    console.log(`Введено в базу redis: ${keyRedis}, ${valueRedis}`);
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// if (redisResult === redisData) {
//   console.log(`В базе redis такие данные уже есть: ${redisResult}`);
// } 
//   else 
//   {

//     await this.redis.set(redisKey, redisData);
//     console.log(`Эти новые данные введены в базу redis: ${redisData}`);
//   } 

        // const func = async () => {
        //   const result = await this.redis.ttl(redisKey);
        //   console.log(result);
        // }
        // func();

        // const ppp = await this.redis.ttl(redisKey)
        // console.log(ppp);

        //.then((result) => { console.log(result)}); // => success!
