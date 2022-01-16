import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { cpu, currentLoad, mem } from 'systeminformation';

import { EnvironmentService } from '../../env/environment/environment.service';
import { MqttClientService } from '../../mqtt/mqtt-client/mqtt-client.service';
import { SystemMonitorConfig } from './system-monitor.types';

@Injectable()
export class SystemMonitorService {
  private readonly config: SystemMonitorConfig;

  constructor(private readonly env: EnvironmentService,
              private readonly mqttClient: MqttClientService) {
    this.config = {
      loadSysInfo: env.getBool('LOAD_SYS_INFO', false),
      monitorCpuTemp: env.getBool('MONITOR_CPU_TEMP', false),
      monitorCpuLoad: env.getBool('MONITOR_CPU_LOAD', true),
      monitorMemLoad: env.getBool('MONITOR_MEM_LOAD', true),
      monitorBattery: env.getBool('MONITOR_BATTERY', false),
      monitorFs: env.getBool('MONITOR_FS', false)
    };

    if (this.config.loadSysInfo) {
      this.loadSystemInfo();
    }

    this.takeSnapshot();
  }

  @Interval(5000)
  takeSnapshot() {
    // if (this.config.monitorCpuTemp) {
    //   cpuTemperature().then(info => console.log(info));
    // }

    if (this.config.monitorCpuLoad) {
      currentLoad().then(this.mqttClient.publishCpuLoad);
    }

    if (this.config.monitorMemLoad) {
      mem().then(this.mqttClient.publishMemLoad);
    }

    // if (this.config.monitorBattery) {
    //   battery().then(info => console.log(info));
    // }
    //
    // if (this.config.monitorFs) {
    //   fsSize().then(info => console.log(info));
    // }
  }

  loadSystemInfo = () => {
    cpu().then(this.mqttClient.publishCpuData);
  };
}
