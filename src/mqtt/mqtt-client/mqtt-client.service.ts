import { Injectable } from '@nestjs/common';

import { connect, IClientOptions, MqttClient } from 'mqtt';

import { BehaviorSubject, take } from 'rxjs';

import { Systeminformation } from 'systeminformation';

import { EnvironmentService } from '../../env/environment/environment.service';
import { MqttClientConfig, MqttClientMessage, publishOpts, topicPathSeparator } from './mqtt-client.types';

@Injectable()
export class MqttClientService {
  private readonly config: MqttClientConfig;

  private readonly client: MqttClient;

  private readonly buffer$ = new BehaviorSubject<MqttClientMessage[]>([]);

  private connected = false;

  constructor(private readonly env: EnvironmentService) {
    this.config = {
      url: env.getString('MQTT_URL', ''),
      user: env.getString('MQTT_USER', ''),
      pass: env.getString('MQTT_PASS', ''),
      id: env.getString('MQTT_INSTANCE_ID', 'pc'),
      prefix: env.getString('MQTT_TOPIC_PREFIX', 'systats')
    };

    if (this.config.url.trim().length === 0) {
      throw new URIError('MQTT URL was not provided.');
    }

    const opts: IClientOptions = {};

    if (this.config.user.trim().length > 0) {
      opts.username = this.config.user;
    }

    if (this.config.pass.trim().length > 0) {
      opts.password = this.config.user;
    }

    this.client = connect(this.config.url, opts);
    this.client.on('connect', this.onConnect);
  }

  publishCpuLoad = (data: Systeminformation.CurrentLoadData) => {
    this.publish(this.getTopicPath('cpu/load/total'), data.currentLoad.toFixed(2));
    this.publish(this.getTopicPath('cpu/load/user'), data.currentLoadUser.toFixed(2));
    this.publish(this.getTopicPath('cpu/load/system'), data.currentLoadSystem.toFixed(2));
    this.publish(this.getTopicPath('cpu/load/nice'), data.currentLoadNice.toFixed(2));
    this.publish(this.getTopicPath('cpu/load/idle'), data.currentLoadIdle.toFixed(2));
    this.publish(this.getTopicPath('cpu/load/irq'), data.currentLoadIrq.toFixed(2));
  };

  publishCpuData=(data:Systeminformation.CpuData)=>{
    this.publish(this.getTopicPath('cpu/info/brand'), data.brand);
    this.publish(this.getTopicPath('cpu/info/vendor'), data.vendor);
    this.publish(this.getTopicPath('cpu/info/speed'), data.speed.toFixed(2));
    this.publish(this.getTopicPath('cpu/info/cores'), data.cores.toString());
    this.publish(this.getTopicPath('cpu/info/physicalCores'), data.physicalCores.toString());
    this.publish(this.getTopicPath('cpu/info/processors'), data.processors.toString());
  }

  private publish = (topic: string, payload: string) => {
    if (this.connected) {
      this.client.publish(topic, payload, publishOpts);
      return;
    }

    this.buffer$
      .pipe(take(1))
      .subscribe(buffer => this.buffer$.next(buffer.concat([ { topic, payload } ])));
  };

  private onConnect = () =>
    this.client.subscribe('presence', error => {
      if (!error) {
        this.client.unsubscribe('presence');
        this.connected = true;

        this.buffer$
          .pipe(take(1))
          .subscribe(buffer => buffer
            .forEach(v => this.publish(v.topic, v.payload)));
      }
    });

  private getTopicPath = (topic: string): string =>
    this.config.prefix
      .split(topicPathSeparator)
      .concat(this.config.id.split(topicPathSeparator))
      .concat(topic.split(topicPathSeparator))
      .join(topicPathSeparator);
}
