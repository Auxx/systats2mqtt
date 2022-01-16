import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { connect, IClientOptions, MqttClient } from 'mqtt';

import { BehaviorSubject, take } from 'rxjs';

import { Systeminformation } from 'systeminformation';

import { MqttClientConfig, MqttClientMessage, publishOpts, topicPathSeparator } from './mqtt-client.types';

@Injectable()
export class MqttClientService {
  private readonly config: MqttClientConfig;

  private readonly client: MqttClient;

  private readonly buffer$ = new BehaviorSubject<MqttClientMessage[]>([]);

  private connected = false;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      url: configService.get('MQTT_URL', ''),
      user: configService.get('MQTT_USER', ''),
      pass: configService.get('MQTT_PASS', ''),
      id: configService.get('MQTT_INSTANCE_ID', 'pc'),
      prefix: configService.get('MQTT_TOPIC_PREFIX', 'systats')
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
            .forEach(v => this.client.publish(v.topic, v.payload, publishOpts)));
      }
    });

  private getTopicPath = (topic: string): string =>
    this.config.prefix
      .split(topicPathSeparator)
      .concat(this.config.id.split(topicPathSeparator))
      .concat(topic.split(topicPathSeparator))
      .join(topicPathSeparator);
}
