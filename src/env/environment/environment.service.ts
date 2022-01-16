import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {
  }

  getString = (key: string, defaultValue = ''): string => this.configService.get(key, defaultValue);

  getBool = (key: string, defaultValue = false): boolean => {
    const value = this.configService.get(key, '').toLowerCase();

    if (value === '') {
      return defaultValue;
    }

    return value === 't'
      || value === 'true'
      || value === '1'
      || value === 'yes'
      || value === 'on'
      || value === 'enabled';
  };

  getNumber = (key: string, defaultValue = 0): number => {
    const value = this.configService.get(key, '');

    if (value === '') {
      return defaultValue;
    }

    const parsed = parseFloat(value);

    return Number.isNaN(defaultValue)
      ? defaultValue
      : parsed;
  };
}
