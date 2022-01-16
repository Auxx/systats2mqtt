import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { battery, cpu, cpuTemperature, currentLoad, fsSize, mem } from 'systeminformation';

@Injectable()
export class SystemMonitorService {
  constructor() {
    this.loadSystemInfo();
  }

  @Interval(5000)
  test() {
    console.log('xxx');

    // cpuTemperature().then(info => console.log(info));
    // mem().then(info => console.log(info));
    // battery().then(info => console.log(info));
    // currentLoad().then(info => console.log(info));
    // fsSize().then(info => console.log(info));
  }

  loadSystemInfo() {
    cpu().then(info => console.log(info));
  }
}
