import { Injectable } from '@nestjs/common';
import { Planificacion } from './planificacion.dto';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TareaEntity } from 'src/tareas/tarea.entity';

@Injectable()
export class PlanificacionService {
  constructor(
    @InjectRepository(TareaEntity)
    private tareaRepository: Repository<TareaEntity>,
  ) {}

  async cargar(data: Planificacion) {
    const { obra, planificacion } = data;
    const planificacionFile = XLSX.read(planificacion.buffer, {
      type: 'buffer',
      cellDates: true,
    });
    console.log(planificacionFile.SheetNames);

    const poryec4sem = XLSX.utils.sheet_to_json(
      planificacionFile.Sheets['Proyección 4 sem'],
    );

    poryec4sem.map(async (fila) => {
      if (fila['Resumen'] == 'No') {
        await this.creandoTarea(fila, obra);
      }
    });

    return 0;
  }

  async creandoTarea(fila, obra) {
    console.log('intentado crear una fila', fila);
    const {
      Grupos,
      Duración,
      plan,
      real,
      Comienzo,
      Fin,
      Bloques,
      OBRAS,
    } = fila;
    console.log('planificacion tarea', plan);
    console.log('real tarea', real);
    const nombre = fila['Nombre de tarea'];

    const tarea = this.tareaRepository.create({
      nombre,
      grupo: Grupos,
      duracion: Duración,
      plan,
      real,
      comienzo: Comienzo,
      fin: Fin,
      bloque: Bloques,
      area_responsable: OBRAS,
      obra,
    });
    this.tareaRepository.save(tarea);
  }
}
