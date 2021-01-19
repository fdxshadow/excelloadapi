import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private serieService: SeriesService) {}

  @Get()
  findAllSeries() {
    return this.serieService.getAll();
  }

  @Post()
  createSerie(@Body() data) {
    return this.serieService.create(data);
  }

  @Get(':id')
  findSerie(@Param('id') id: number) {
    return this.serieService.getOne(id);
  }

  @Put()
  updateSerie(@Param('id') id: number, @Body() data) {
    return this.serieService.update(id, data);
  }

  @Delete()
  destroySerie(@Param('id') id: number) {
    return this.serieService.destroy(id);
  }
}
