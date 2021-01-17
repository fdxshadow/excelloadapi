import { Module } from '@nestjs/common';
import { ObrasController } from './obras.controller';

@Module({
  controllers: [ObrasController]
})
export class ObrasModule {}
