import { Controller, Get, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
//import { statsPerDay } from './modules/chat/types/statsPerDay';

@Controller('') export class AppController {
  constructor(private readonly appService: AppService, @InjectRedis() private readonly redis: Redis) {}

  async getRedis(@Body() inputRedisKey: string) {

      let cursor = 0; const pattern = '*а*';  // шаблон ключей              ===  S C A N  по базе  R e d i s  ===
      const arrayKey = await this.redis.scan(cursor, 'MATCH', pattern); // А это просто получение результатов Scan в массив
      console.log(arrayKey[1]);                                         // А это просто получение результатов Scan в массив

      //==============  S C A N  по базе  R e d i s  ===================   // Начинаем поиск с курсора 0 и сопоставляемый шаблон
      const processKeys = (err, reply) => {      // А это с использованием Функции для обработки найденных ключей
        if (err) { console.error('Ошибка при выполнении команды SCAN:', err);  return; }
        const [nextCursor, keys] = reply;
        keys.forEach((key) => {  console.log(`Нашел такие ключи в базе Redis: ${key}`); });  // Обрабатываем найденные ключи
        // Если cursor равен 0, значит поиск завершен
        if (nextCursor === '0') { console.error(`По шаблону "${pattern}" не нашел больше ни одного ключа в базе Redis = `, err);  return; }
        cursor = nextCursor;   // Продолжаем поиск со следующим курсором
        this.redis.scan(cursor, 'MATCH', pattern, processKeys);
      };
      this.redis.scan(cursor, 'MATCH', pattern, processKeys);    // Выполняем первый поиск
      //=============================================================================================================================
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
