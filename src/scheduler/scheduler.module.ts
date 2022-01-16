import { Module } from '@nestjs/common';

import { MqttModule } from '../mqtt/mqtt.module';
import { SystemMonitorService } from './system-monitor/system-monitor.service';

@Module({
  providers: [ SystemMonitorService ],
  exports: [ SystemMonitorService ],
  imports: [ MqttModule ]
})
export class SchedulerModule {
}
