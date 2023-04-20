import { Controller, Get, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
//import { statsPerDay } from './modules/chat/types/statsPerDay';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService, @InjectRedis() private readonly redis: Redis) {}

  async getRedis(@Body() inputRedisKey: string) {
    const redisResult = await this.redis.get(inputRedisKey);
    return redisResult;
  }

  async setRedis(@Body() inputKeyRedis: string, inputDateStats: string) {
    const userStats = await this.redis.get(inputKeyRedis)
    if (userStats && JSON.parse(userStats)[inputDateStats]) {
      const objUserStats = JSON.parse(userStats);
      const objCountMessage = objUserStats[inputDateStats];
      const countMessage = Number(objCountMessage.messagesSent) + 1;
      objUserStats[inputDateStats] = {"messagesSent": countMessage};
      await this.redis.set(inputKeyRedis, JSON.stringify(objUserStats));
    } else if (userStats) {
        const objUserStats = JSON.parse(userStats);
        objUserStats[inputDateStats] = { "messagesSent": 1 }; 
        await this.redis.set(inputKeyRedis, JSON.stringify(objUserStats));
    } else {
        const strStatsPerDay = `{ "${inputDateStats}": { "messagesSent": ${1} } }`;
        const objUserStats = JSON.parse(strStatsPerDay);
        objUserStats[inputDateStats]
        await this.redis.set(inputKeyRedis, JSON.stringify(objUserStats));    
    } 
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// const statsPerDay = {
//   "statsPerDay": {
//     date: {
//       "messagesSent": 0
//     }
//   }
// }

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
