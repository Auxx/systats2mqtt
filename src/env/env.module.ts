import { Module } from '@nestjs/common';

import { EnvironmentService } from './environment/environment.service';

@Module({
  providers: [ EnvironmentService ],
  exports: [ EnvironmentService ]
})
export class EnvModule {
}
