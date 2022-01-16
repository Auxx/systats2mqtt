import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { SystemMonitorService } from './system-monitor/system-monitor.service';

@Module({
  providers: [ SystemMonitorService ],
  exports: [ SystemMonitorService ],
  imports: [ MqttModule, EnvModule ]
})
export class SchedulerModule {
}
