import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';

import { battery, cpu, cpuTemperature, currentLoad, fsSize, mem } from 'systeminformation';
import { MqttClientService } from '../../mqtt/mqtt-client/mqtt-client.service';
import { SystemMonitorConfig } from './system-monitor.types';

@Injectable()
export class SystemMonitorService {
  private readonly config: SystemMonitorConfig;

  constructor(private readonly configService: ConfigService,
              private readonly mqttClient: MqttClientService) {
    this.config = {
      loadSysInfo: configService.get('LOAD_SYS_INFO', false),
      monitorCpuTemp: configService.get('MONITOR_CPU_TEMP', false),
      monitorCpuLoad: configService.get('MONITOR_CPU_LOAD', true),
      monitorMemLoad: configService.get('MONITOR_MEM_LOAD', true),
      monitorBattery: configService.get('MONITOR_BATTERY', false),
      monitorFs: configService.get('MONITOR_FS', false)
    };

    if (this.config.loadSysInfo) {
      this.loadSystemInfo();
    }

    this.takeSnapshot();
  }

  @Interval(60000)
  takeSnapshot() {
    // if (this.config.monitorCpuTemp) {
    //   cpuTemperature().then(info => console.log(info));
    // }

    if (this.config.monitorCpuLoad) {
      currentLoad().then(this.mqttClient.publishCpuLoad);
    }

    // if (this.config.monitorMemLoad) {
    //   mem().then(info => console.log(info));
    // }
    //
    // if (this.config.monitorBattery) {
    //   battery().then(info => console.log(info));
    // }
    //
    // if (this.config.monitorFs) {
    //   fsSize().then(info => console.log(info));
    // }
  }

  loadSystemInfo() {
    cpu().then(info => console.log(info));
  }
}
