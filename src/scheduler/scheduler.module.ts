import { Module } from '@nestjs/common';
import { SystemMonitorService } from './system-monitor/system-monitor.service';

@Module({
  providers: [SystemMonitorService]
})
export class SchedulerModule {}
