import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionController } from './planificacion.controller';

describe('PlanificacionController', () => {
  let controller: PlanificacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificacionController],
    }).compile();

    controller = module.get<PlanificacionController>(PlanificacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
