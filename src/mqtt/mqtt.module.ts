import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { MqttClientService } from './mqtt-client/mqtt-client.service';

@Module({
  providers: [ MqttClientService ],
  exports: [ MqttClientService ],
  imports: [ EnvModule ]
})
export class MqttModule {
}
