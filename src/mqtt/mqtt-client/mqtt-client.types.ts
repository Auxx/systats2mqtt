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

export interface AutoRegistration {
  registered: boolean;
  entities: AutoRegistrationEntity[];
}

export interface AutoRegistrationEntity {
  unit: string;
  icon: string;
  topic: string;
  sensorName: string;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
}

export const topicPathSeparator = '/';

export const pathReplacer = new RegExp(topicPathSeparator, 'g');

export const publishOpts: IClientPublishOptions = {
  retain: true,
  qos: 0
};

export const autoRegistryTopic = 'homeassistant/sensor/systats';

export const autoRegistration: Record<string, AutoRegistration> = {
  cpuLoad: {
    registered: false,
    entities: [
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/total',
        sensorName: 'CPU Usage',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      },
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/user',
        sensorName: 'CPU Usage (User)',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      },
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/system',
        sensorName: 'CPU Usage (System)',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      },
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/nice',
        sensorName: 'CPU Usage (Nice)',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      },
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/idle',
        sensorName: 'CPU Usage (Idle)',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      },
      {
        unit: '%',
        icon: 'mdi:speedometer',
        topic: 'cpu/load/irq',
        sensorName: 'CPU Usage (IRQ)',
        deviceId: 'cpu-load',
        deviceName: 'CPU Load',
        deviceModel: 'CPU Load Monitor'
      }
    ]
  }
};
