import { Module } from '@nestjs/common';

import { MqttClientService } from './mqtt-client/mqtt-client.service';

@Module({
  providers: [ MqttClientService ],
  exports: [ MqttClientService ]
})
export class MqttModule {
}
