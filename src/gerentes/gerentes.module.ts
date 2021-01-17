import { Module } from '@nestjs/common';
import { GerentesController } from './gerentes.controller';

@Module({
  controllers: [GerentesController]
})
export class GerentesModule {}
