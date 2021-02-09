import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SupervisorService } from './supervisor.service';

@Controller('supervisor')
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @Get()
  findAllSupervisores() {
    return this.supervisorService.getAll();
  }

  @Post()
  createSupervisor(@Body() data) {
    return this.supervisorService.create(data);
  }

  @Get(':id')
  findSupervisor(@Param('id') id: number) {
    return this.supervisorService.getOne(id);
  }

  @Put()
  updateSupervisor(@Param('id') id: number, @Body() data) {
    return this.supervisorService.update(id, data);
  }

  @Delete()
  destroySupervisor(@Param('id') id: number) {
    return this.supervisorService.destroy(id);
  }
}
