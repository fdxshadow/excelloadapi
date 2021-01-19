import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GerenteEntity } from './gerente.entity';
import { GerentesController } from './gerentes.controller';
import { GerentesService } from './gerentes.service';

@Module({
  imports: [TypeOrmModule.forFeature([GerenteEntity])],
  controllers: [GerentesController],
  providers: [GerentesService],
})
export class GerentesModule {}
