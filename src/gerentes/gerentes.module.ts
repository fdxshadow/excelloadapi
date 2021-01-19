import { Module } from '@nestjs/common';
import { GerentesController } from './gerentes.controller';
import { GerentesService } from './gerentes.service';

@Module({
  controllers: [GerentesController],
  providers: [GerentesService],
})
export class GerentesModule {}
