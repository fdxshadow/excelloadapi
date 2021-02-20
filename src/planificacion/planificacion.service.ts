import { BadRequestException, Injectable } from '@nestjs/common';
import { Planificacion } from './planificacion.dto';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { SemanasEntity } from 'src/tareas/semanas.entity';
import { PlanificacionEntity } from './planificacion.entity';

@Injectable()
export class PlanificacionService {
  constructor(
    @InjectRepository(TareaEntity)
    private tareaRepository: Repository<TareaEntity>,
    @InjectRepository(SemanasEntity)
    private semanaRepository: Repository<SemanasEntity>,
    @InjectRepository(PlanificacionEntity)
    private planificacionRepository: Repository<PlanificacionEntity>,
  ) {}

  async cargar(data: Planificacion) {
    const { obra, planificacion } = data;
    const planificacionFile = XLSX.read(planificacion.buffer, {
      type: 'buffer',
      cellDates: true,
    });

    const poryec4sem = XLSX.utils.sheet_to_json(
      planificacionFile.Sheets['Programación de obra'],
    );

    const planif = await this.planificacionRepository.findOne({obra:{id:obra}});
    if(planif){
      throw new BadRequestException('La obra seleccionada, ya posee una planificacion cargada');
    }
    
    const nuevaPlanificacion = await this.planificacionRepository.create({obra:{id:obra}});
    await this.planificacionRepository.save(nuevaPlanificacion);

    poryec4sem.map(async (fila) => {
      if (fila['Resumen'] == 'No') {
        await this.creandoTarea(fila, nuevaPlanificacion.id);
      }
    });
  }

  async creandoTarea(fila, planificacion) {
    const {
      Grupos,
      Duración,
      plan,
      real,
      Comienzo,
      Fin,
      Bloques,
      OBRAS,
      ... rest
    } = fila;
    const nombre = fila['Nombre de tarea'];

    const tarea = await this.tareaRepository.create({
      nombre,
      grupo: Grupos,
      duracion: Duración,
      plan,
      real,
      comienzo: Comienzo,
      fin: Fin,
      bloque: Bloques,
      area_responsable: OBRAS,
      planificacion: planificacion
    });
    await this.tareaRepository.save(tarea);
    await this.cargarSemanas(tarea.id,rest);
  }


  async cargarSemanas(id, fila){
    for (let index = 0; index <= 60; index++) {
      if(fila[`${index} `]){
        //crear la semana y estoy
        let semanaNueva = await this.semanaRepository.create({semana:index,tarea:{id},carga_trabajo:fila[`${index} `]});
        await this.semanaRepository.save(semanaNueva);
      }
    }
  }


}
