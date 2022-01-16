import { IClientPublishOptions } from 'mqtt/types/lib/client-options';

export interface MqttClientConfig {
  url: string;
  user: string;
  pass: string;
  id: string;
  prefix: string;
}

export interface MqttClientMessage {
  topic: string;
  payload: string;
}

export const topicPathSeparator = '/';

export const publishOpts: IClientPublishOptions = {
  retain: true,
  qos: 1
};
