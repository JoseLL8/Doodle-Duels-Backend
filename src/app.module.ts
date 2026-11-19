import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { KeyvCacheableMemory } from 'cacheable';
import { Keyv, createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './health/health.module.js';
import envSchema from './env.schema.js';

//const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
//dotenv.config({ path: envFile });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: envSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
          const dbConfig: TypeOrmModuleOptions = {
              type: configService.getOrThrow<string>('BBDD_CONNECTION') as any,
              host: configService.getOrThrow<string>('BBDD_HOST'),
              port: configService.getOrThrow<number>('BBDD_PORT'),
              username: configService.getOrThrow<string>('BBDD_USERNAME'),
              password: configService.getOrThrow<string>('BBDD_ROOT_PASSWORD'),
              database: configService.getOrThrow<string>('BBDD_DATABASE_NAME'),
              autoLoadEntities: true,
              synchronize: configService.getOrThrow<string>('BBDD_SYNCHRONIZE') === 'development', // Valor comparado contra el .env
              //ssl: configService.getOrThrow<boolean>('BBDD_SSL'), // Valor comparado contra el .env
              ssl: false, //todo support ssl with certificate in deployment?
              extra: {
                  /*ssl: configService.getOrThrow<boolean>('BBDD_SSL') // Valor comparado contra el .env
                      ? { rejectUnauthorized: false }
                      : null,*/
                  ssl: false //todo support ssl with certificate in deployment?
              },
              //logging: ['query', 'error', 'schema'], // Logs detallados
          };
        return dbConfig;
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.getOrThrow<string>('REDIS_HOST');
        const redisPort = configService.getOrThrow<number>('REDIS_PORT');
        const redisStore = createKeyv(`redis://${redisHost}:${redisPort}`);
        redisStore.on('error', (err) => console.error('Redis error:', err));
        

        return {
          stores: [
            //first is default, default to local
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            redisStore
            //redis fallback
          ],
        };
      },
    }),
    HealthModule,
    UserModule
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor //cache results by default on all GET endpoints
  }],
})
export class AppModule {}
