import { BadRequestException, Injectable } from '@nestjs/common';
import { Planificacion } from './planificacion.dto';
import * as XLSX from 'xlsx';
import { createQueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { SemanasEntity } from 'src/tareas/semanas.entity';
import { PlanificacionEntity } from './planificacion.entity';
import { resolve } from 'path';

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
      //planificacionFile.Sheets['Programación de obra'],
      planificacionFile.Sheets['Programación Obra'],
    );


    const controlSem = XLSX.utils.sheet_to_json(
      //planificacionFile.Sheets['Programación de obra'],
      planificacionFile.Sheets['Datos reales sem'],
    );


    const planif = await this.planificacionRepository.findOne({obra:{id:obra}});
    if(planif){
      throw new BadRequestException('La obra seleccionada, ya posee una planificacion cargada');
    }
    
    const nuevaPlanificacion = await this.planificacionRepository.create({obra:{id:obra}});
    await this.planificacionRepository.save(nuevaPlanificacion);

    poryec4sem.map(async (fila) => {
      if (fila['Resumen'] == 'No') {
        let filaControl= await controlSem.find(con=>con[' Id ']==fila[' Id ']);
        await this.creandoTarea(fila,filaControl, nuevaPlanificacion.id);
      }
    });
  }

  async creandoTarea(fila, filaControl,planificacion) {
    const {
      Grupos,
      Duración,
      Comienzo,
      Fin,
      Bloques,
      OBRAS,
      PESO,
      Trabajo,
      ... rest
    } = fila;
    const nombre = fila['Nombre de tarea'];

    const tarea = await this.tareaRepository.create({
      nombre,
      grupo: Grupos,
      duracion: Duración,
      comienzo: Comienzo,
      fin: Fin,
      bloque: Bloques,
      area_responsable: OBRAS,
      peso: PESO,
      trabajo: Trabajo,
      planificacion: planificacion
    });
    await this.tareaRepository.save(tarea);
    await this.cargarSemanas(tarea.id,rest,filaControl);
  }


  async cargarSemanas(id, fila,filaControl){
    for (let index = 0; index <= 8; index++) {
      if(fila[`${index} `]){
        //crear la semana y estoy
        console.log("filaControlSem",filaControl[`${index} `]);
        let filaControlSem = (filaControl[`${index} `])?filaControl[`${index} `]*100:0;
        //console.log("filaControlSem",filaControlSem);
        let semanaNueva = await this.semanaRepository.create({semana:index,tarea:{id},carga_trabajo:fila[`${index} `],trabajo_efectivo:filaControlSem.toString()});
        await this.semanaRepository.save(semanaNueva);
      }
    }
  }


  async getDataCurvaS(id_obra:number){
    const planificacionByObra = await this.planificacionRepository.findOne({where:{obra:id_obra}});
    if(!planificacionByObra){
      throw new BadRequestException('Planificacion no encontrada para la obra');
    }

    //se usa la segunda hoja (carga de trabajo)
    const sumPesoCarga = await createQueryBuilder('tareas','t')
          .select("SUM(t.peso*trabajo_efectivo) as pesoxcarga,semana")
          .innerJoin("semanas","s","t.id=s.tarea")
          .where(`planificacionId = ${planificacionByObra.id}`)
          .groupBy("semana")
          .getRawMany();
    const sumTrabajo = await createQueryBuilder('tareas','t')
          .select("SUM(t.trabajo) as sumTrabajo")
          .where(`planificacionId = ${planificacionByObra.id}`)
          .getRawOne();

    const sumSemanas = await createQueryBuilder('tareas','t')
          .select("SUM(carga_trabajo) as sumcarga,semana")
          .innerJoin("semanas","s","t.id=s.tarea")
          .where(`planificacionId = ${planificacionByObra.id}`)
          .groupBy("semana")
          .getRawMany();
    
    //console.log("suma de trabajo",sumTrabajo);
    let programado = await this.calcularProgramado(sumSemanas,sumTrabajo);
    let avanceRealSemana = await this.calcularAcumulado(sumPesoCarga);
    let semanas = await sumSemanas.map(sem=>sem.semana);

    return {labels:semanas,dataProgramado:programado,dataReal:avanceRealSemana}
  }


  async calcularAcumulado(semanas_carga:any){
    let acumulado_semana=await semanas_carga.map(async (semana_carga)=>{
      let acumulado = await semanas_carga.filter(semanabusq=>semanabusq.semana<=semana_carga.semana);
      let result_semana = await acumulado.reduce((acc,curr)=>{
        return {pesoxcarga:acc['pesoxcarga'] + curr['pesoxcarga']};
      });
     return result_semana.pesoxcarga;
    });
    return Promise.all(acumulado_semana);
  }

  async calcularProgramado(semanas_carga:any,sumtrabajo:any){
    let programado = await semanas_carga.map(async sem=>{
      //acumulado tambien
      let acumulado = await semanas_carga.filter(semanabusq=>semanabusq.semana<=sem.semana);
      let result_semana = await acumulado.reduce((acc,curr)=>{
        return {sumcarga:Number(acc['sumcarga']) + Number(curr['sumcarga'])};
      });
      return ((result_semana.sumcarga/sumtrabajo['sumTrabajo'])*100).toFixed(1);
    });
    return  Promise.all(programado);
  }


}
