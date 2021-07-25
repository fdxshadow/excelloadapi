import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObrasService } from 'src/obras/obras.service';
import { createQueryBuilder, Repository } from 'typeorm';
import { SemanasEntity } from './semanas.entity';
import { TareaEntity } from './tarea.entity';
import * as moment from  'moment';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(TareaEntity)
    private tareasRepository: Repository<TareaEntity>,
    @InjectRepository(SemanasEntity)
    private semanaRepository: Repository<SemanasEntity>,
    private obraService: ObrasService
  ) {}

  async getAll() {
    return await this.tareasRepository.find();
  }

  async getByObraAssignUser(id_usuario:number){
    const tareas = await createQueryBuilder('planificacion','p')
    .select("t.*")
    .innerJoin("obras","o","p.obra=o.id")
    .innerJoin("supervisor","s","s.obra=o.id")
    .innerJoin("tareas","t","p.id=t.planificacion")
    .where(`s.usuarioId = ${id_usuario}`)
    .getRawMany();

    return tareas;
  }

  async create(data) {
    const tarea = this.tareasRepository.create(data);
    await this.tareasRepository.save(tarea);
    return tarea;
  }

  async getOne(id: number) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return tarea;
  }

  async update(id: number, data) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.tareasRepository.update({ id }, data);
    return this.tareasRepository.findOne({ id });
  }

  async destroy(id: number) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.tareasRepository.delete({ id });
    return { deleted: true };
  }

  async getTareasByArea(area:string,id_usuario,sem){

    console.log("semana servicio tarea",sem);
   
    /*if(sem==undefined){
      throw new BadRequestException('La semana actual es necesaria para obtener los registros');
    }*/
    const areas = await createQueryBuilder('planificacion','p')
    .select("t.*")
    .innerJoin("obras","o","p.obra=o.id")
    .innerJoin("supervisor","s","s.obra=o.id")
    .innerJoin("tareas","t","p.id=t.planificacion")
    .where(`s.usuarioId = ${id_usuario}`)
    .andWhere(`t.area_responsable='${area}'`)
    .getRawMany();

    let result = await  areas.map(async tA=>{
      tA['comienzo'] = moment(tA['comienzo']).format("DD-MM-YY");//tA['comienzo'].toLocaleDateString();
      tA['fin'] =  moment(tA['fin']).format("DD-MM-YY");//tA['fin'].toLocaleDateString();
      const semanas = await this.getSemanasByTarea(tA['id']);
      let porc_esperado = 0;
      let porc_real = 0;
      await semanas.filter(s=> s.semana<=sem).forEach(semFilt=>{
        porc_esperado += semFilt.carga_trabajo;
        porc_real += Number(semFilt.trabajo_efectivo);
      });

      
      tA['porc_real']=Number(porc_real).toFixed(2);
      tA['porc_esperado']=Number(porc_esperado).toFixed(2);
      const semanaActualTarea = await semanas.find(s=> s.semana == sem);
      tA['avance_semana']= (semanaActualTarea)?semanaActualTarea.trabajo_efectivo:0
      return tA;
    });

    return Promise.all(result);

  }

  async getSemanasByTarea(tarea_id:number){
    const semana = await this.semanaRepository.find({select:['id','semana','trabajo_efectivo','carga_trabajo'],where:{tarea:tarea_id}});
    const resultSemana = await this.getCalcularPorcEsperado(tarea_id);
    return await semana.map(s=>{
      s['carga_trabajo'] =  (Number(s['carga_trabajo'])*100)/Number(resultSemana);
      return s;
    });
  }


  async getCalcularPorcEsperado(id_tarea,){
    /*if(semana>0){
      const sumEsperado = await createQueryBuilder('semanas','s')
      .select("SUM(carga_trabajo) as sumCarga")
      .where(`s.tareaId = ${id_tarea}`)
      .andWhere(`s.semana <= ${semana}`)
      .getRawOne();
      //console.log(sumEsperado);
      return sumEsperado['sumCarga']!=null?sumEsperado['sumCarga']:0;
    }else{*/
      const sumEsperado = await createQueryBuilder('semanas','s')
    .select("SUM(carga_trabajo) as sumCarga")
    .where(`s.tareaId = ${id_tarea}`)
    .getRawOne();
    return sumEsperado['sumCarga'];
    //}

    
  }

  async updatePorcAvanceSem(semana){
    const {id,avance_semana,semana_actual} = semana;


    const semanaDb = await this.semanaRepository.findOne({tarea:id, semana:semana_actual});
    if(semanaDb){
      let porc_real = 0;
      semanaDb.trabajo_efectivo = avance_semana
      await this.semanaRepository.save(semanaDb);
      const semanas = await this.getSemanasByTarea(id);
      await semanas.filter(s=> s.semana<=semana_actual).forEach(semFilt=>{
        porc_real += Number(semFilt.trabajo_efectivo);
      });

      return {nuevo_porc_real:porc_real}
    }
    //que hacer en caso de que la semana actual no exista en la planificacion con respecto a los datos de la tarea como carga_trabajo
    /*else{
      const nuevaSemanaTarea = this.semanaRepository.create({semana: semana['semana'],trabajo_efectivo:semana['trabajo_efectivo'],tarea:semana['tarea_id'],carga_trabajo:100});
    }*/


    /*if(semana['id']!=null){
      const semanaDb = await this.semanaRepository.findOne({where:{id:semana['id']}});
      semanaDb.trabajo_efectivo = semana['trabajo_efectivo'];
      return await this.semanaRepository.save(semanaDb);
    }else{
      const atraso = this.semanaRepository.create({semana: semana['semana'],trabajo_efectivo:semana['trabajo_efectivo'],tarea:semana['tarea_id'],carga_trabajo:100});
      return this.semanaRepository.save(atraso);
    }*/
  }

  async getTareasByObra(id_obra){
   const tareas = await createQueryBuilder('tareas','t')
   .select('t.*')
   .innerJoin('planificacion','p','p.id=t.planificacionId')
   .where(`p.obraId=${id_obra}`)
   .getRawMany();
    return tareas;
  }
}
