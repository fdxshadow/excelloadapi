import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorEntity } from './supervisor.entity';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupervisorEntity])],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
