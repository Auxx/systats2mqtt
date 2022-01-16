import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MqttModule,
    SchedulerModule,
    EnvModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {
}
