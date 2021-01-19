import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerieEntity } from './serie.entity';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [TypeOrmModule.forFeature([SerieEntity])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
