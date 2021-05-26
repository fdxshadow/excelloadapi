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

    const planif = await this.planificacionRepository.findOne({obra:{id:obra}});
    if(planif){
      throw new BadRequestException('La obra seleccionada, ya posee una planificacion cargada');
    }
    
    const nuevaPlanificacion = await this.planificacionRepository.create({obra:{id:obra}});
    await this.planificacionRepository.save(nuevaPlanificacion);







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
    for (let index = 0; index <= 60; index++) {
      if(fila[`${index} `]!= undefined){
        //crear la semana y estoy
        console.log("filaControlSem",filaControl[`${index} `]);
        let filaControlSem = (filaControl[`${index} `]!=undefined)?filaControl[`${index} `]*100:0;
        //console.log("filaControlSem",filaControlSem);
        let semanaNueva = await this.semanaRepository.create({semana:index,tarea:{id},carga_trabajo:fila[`${index} `],trabajo_efectivo:filaControlSem.toString()});
        await this.semanaRepository.save(semanaNueva);
      }
    }
  }




  async getDataCurvaS(id_obra:number){
    const planificacionByObra = await this.getPlanificacion(id_obra);

    //se usa la segunda hoja (carga de trabajo)
    const sumPesoCarga = await createQueryBuilder('tareas','t')
          .select("SUM(t.peso*trabajo_efectivo) as pesoxcarga,semana")
          .innerJoin("semanas","s","t.id=s.tarea")
          .where(`planificacionId = ${planificacionByObra.id}`)
          .andWhere('trabajo_efectivo>0')
          .groupBy("semana")
          .getRawMany();
         
         /* return sumPesoCarga;

          let avanceRealSemana = await this.calcularAcumulado(sumPesoCarga);
          return avanceRealSemana;*/


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

    let primeraTarea=await this.tareaRepository.findOne({where:{planificacion:{id:planificacionByObra.id}},order:{id: 'DESC'}});
    let semInicial = primeraTarea.comienzo;
    let semanas = await sumSemanas.map((sem,i)=>{
      if(i==0){
        console.log("semana inicial sin editar",semInicial);
        if(semInicial.getDay()==0){
          semInicial.setDate(semInicial.getDate() + 1);
          console.log("semana sumando 1",semInicial)
          return semInicial;
        }
        if(semInicial.getDay()==1){
          return semInicial;
        }
        if(semInicial.getDay()>1){
          semInicial.setDate(semInicial.getDate() - (semInicial.getDay() - 1));
          console.log("semana inicial editada",semInicial);
          return semInicial;
        }
      }
      let semCal = new Date(semInicial.getFullYear(),semInicial.getMonth(),semInicial.getDate() + (i*7));
      return semCal;

      
    });

    return {labels:semanas,dataProgramado:programado,dataReal:avanceRealSemana}
  }


  async getPlanificacion(id_obra:number){
    const planificacionByObra = await this.planificacionRepository.findOne({where:{obra:id_obra}});
    if(!planificacionByObra){
      throw new BadRequestException('Planificacion no encontrada para la obra');
    }
    return planificacionByObra;
  }


  async calcularAcumulado(semanas_carga:any){
    let acumulado_semana=await semanas_carga.map(async (semana_carga)=>{
      let acumulado = await semanas_carga.filter(semanabusq=>semanabusq.semana<=semana_carga.semana);
      let result_semana = await acumulado.reduce((acc,curr)=>{
        return {pesoxcarga:acc['pesoxcarga'] + curr['pesoxcarga']};
      });
     return Number(result_semana.pesoxcarga);
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
      return ((result_semana.sumcarga/sumtrabajo['sumTrabajo'])*100);
    });
    return  Promise.all(programado);
  }


  async getEficiencia(id_obra:number){
    let dataCurvaS = await this.getDataCurvaS(id_obra);
    let eficiencia = await this.getCalculoEficienciaSem(dataCurvaS.dataProgramado,dataCurvaS.dataReal);
    let arregloBase = new Array(dataCurvaS.dataProgramado.length).fill(100);

    return {eficiencia,arregloBase,labels:dataCurvaS.labels};

  }

  async getCalculoEficienciaSem(data_programada,data_real){
      let eficiencia = await data_real.map((v,i)=>{
        return ((v/data_programada[i])*100).toFixed(2);
      });
      return eficiencia
  }



  async getVariacionSup(id_obra:number,sem:number){
    const planificacionByObra = await this.getPlanificacion(id_obra);
    const tareasObra = await this.tareaRepository.find({select:['id','nombre','trabajo','area_responsable','peso'],where:{planificacion:planificacionByObra},relations:['semanas']});
    let tareasCalculadas = await this.getAvanceProgramadoReal(tareasObra);
    //return tareasCalculadas;
    let porcVariacionAgrup = await this.agruparTipo(tareasCalculadas,sem);
    //let porcIncidencia = await this.incidencia(porcVariacionAgrup);
    //return tareasCalculadas;
    return porcVariacionAgrup;
  }

  async getAvanceProgramadoReal(tareas){
    const avanceProgByTarea=await tareas.map(async tarea=>{
        let avanceProgSem = await tarea['semanas'].map(async semana=>{
          let semanasFiltradas = await tarea['semanas'].filter(sem=>sem.semana<=semana.semana);
          let resultAcumulado = await semanasFiltradas.reduce((curr,next)=>{
            return {carga_trabajo:curr.carga_trabajo + next.carga_trabajo,trabajo_efectivo:Number(curr.trabajo_efectivo) + Number(next.trabajo_efectivo)}
          });
          
          return {semana: semana.semana,avanceEsperado:(resultAcumulado['carga_trabajo']/Number(tarea.trabajo))*100,avanceReal:Number(resultAcumulado['trabajo_efectivo']),variacionPorc:Number(resultAcumulado['trabajo_efectivo']) - (Number(resultAcumulado['carga_trabajo'])/Number(tarea.trabajo)*100)}
        });
        tarea.semanas = await Promise.all(avanceProgSem);
        return tarea;
    });

    return Promise.all(avanceProgByTarea);
  }


   async agruparTipo(tareasCalculadas,sem){
    let arraySupTipoDone = [];
    let tareasGroupSupTipo = []
    await tareasCalculadas.forEach(async t=>{
      if(!arraySupTipoDone.includes(t['area_responsable'])){
        await arraySupTipoDone.push(t['area_responsable']);
        let tareasTipo = await tareasCalculadas.filter(tc=>tc['area_responsable']==t['area_responsable']);
        let semanaSeleccionada = [];
        await tareasTipo.forEach(async tt => {
          let semanaTarea=await tt.semanas.filter(tts=> tts.semana<=sem);
          //editar elemento y multiplicar variacionPorc por peso
            if(semanaTarea.length>0){
              let ultimo = semanaTarea.length - 1;
              semanaTarea[0].variacionPorc = Math.abs(semanaTarea[ultimo].variacionPorc)*tt.peso;
              semanaSeleccionada.push(semanaTarea[0]);
            }
        });
        if(semanaSeleccionada.length>0){
          let acumuladoTipo = await semanaSeleccionada.reduce((curr,next)=>{
            return {variacionPorc:curr.variacionPorc + next.variacionPorc};
          });
          await tareasGroupSupTipo.push({area_responsable:t['area_responsable'],porcVariacion:acumuladoTipo.variacionPorc});
        }else{
          await tareasGroupSupTipo.push({area_responsable:t['area_responsable'],porcVariacion:0});
        }
      }
    });
    return tareasGroupSupTipo;
  }
}
