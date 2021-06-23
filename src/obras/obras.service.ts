import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { PlanificacionEntity } from 'src/planificacion/planificacion.entity';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { ObraEntity } from './obra.entity';
import * as moment from  'moment';
import { PlanificacionService } from 'src/planificacion/planificacion.service';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(ObraEntity)
    private obraRepository: Repository<ObraEntity>,
    @InjectRepository(GerenteEntity)
    private gerenteRepository: Repository<GerenteEntity>,
    @InjectRepository(SupervisorEntity)
    private supervisorRepository: Repository<SupervisorEntity>,
    private planificacionService: PlanificacionService

  ) {}

  async getAll() {
    return await this.obraRepository.find({relations: ["empresa"]});
  }

  async create(data) {
    const obra = this.obraRepository.create(data);
    await this.obraRepository.save(obra);
    return obra;
  }

  async getOne(id: number) {
    const obra = await this.obraRepository.findOne({ where:{id}, relations: ['empresa']});
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    return obra;
  }

  async update(id: number, data) {
    const obra = await this.obraRepository.findOne({ id });
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.obraRepository.update({ id }, data);
    return this.obraRepository.findOne({ id });
  }

  async destroy(id: number) {
    /*const obra = await this.obraRepository.findOne({ id });
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }*/
    /*await createQueryBuilder()
    .delete()
    .from('gerentes_obras_obras')
    .where(`obrasId = ${id}`)
    .execute();
    return 1;*/
    return await this.obraRepository.delete({ id })
    /*this.obraRepository.delete({ id }).then(resp=>{
      return resp;
    }).catch(e=>{
      console.log(e);
    });*/
  }

  async getByEmpresa(id_empresa: number) {
    const obras = await this.obraRepository.find({
      where: { empresa: id_empresa },
    });
    if (!obras) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    return obras;
  }

  async getByGerente(id_usuario: number) {
    const gerente = await (await this.gerenteRepository.findOne({relations: ['obras','obras.empresa'], where: {usuario:id_usuario}})).obras;
    if (!gerente) {
      throw new HttpException('Gerente no encontrado', HttpStatus.NOT_FOUND);
    }
    const response = await gerente.map(async obra=>{
      obra['semana_actual']= await this.getSemanaActual(this.getMonday(obra.fecha_inicio));;
      obra['porc_avance_real']=Number(await (await this.planificacionService.getDataCurvaS(obra.id)).dataReal[obra['semana_actual']-1]).toFixed(2);
      return obra;
    });
    return Promise.all(response);
  }


  async getAreaByObra(obra_id: number){
    const areas = await createQueryBuilder('planificacion','p')
    .select("DISTINCT t.area_responsable as nombreArea")
    .innerJoin("tareas","t","p.id=t.planificacion")
    .where(`obraId = ${obra_id}`)
    .getRawMany();

    if(areas.length==0){
      throw new NotFoundException("No se puede crear un supervisor en una obra sin planificacion");
    }
    return areas;
  }

  async getEstadoObra(id_usuario:number){
    const semanaInicio = await this.supervisorRepository.findOne({where:{usuario:id_usuario},relations:['obra']});
    if(!semanaInicio){
      throw new BadRequestException("No se encuentra obra asociada al supervisor");
    }
    const lunesSemanaInicio = await this.getMonday(semanaInicio.obra.fecha_inicio);
    const semanaActual = this.getSemanaActual(lunesSemanaInicio);
    const curvaSResult =  await this.planificacionService.getDataCurvaS(semanaInicio.obra.id);
    const dataReal =curvaSResult.dataReal;
    const avanceReal = dataReal.length >= semanaActual ? dataReal[semanaActual-1]:dataReal[dataReal.length - 1];
    const avanceProg = curvaSResult.dataProgramado.length >= semanaActual ? curvaSResult.dataProgramado[semanaActual-1]:curvaSResult.dataProgramado[curvaSResult.dataProgramado.length - 1];
    return {semanaActual:semanaActual,porc_avance:Number(avanceReal).toFixed(2), porc_prog: Number(avanceProg).toFixed(2)};
  }


  getMonday(d:Date) {
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }


  getSemanaActual(lunesSemanaInicio:Date){
    let fecha =  moment(lunesSemanaInicio);
    if(fecha.isSame(moment(new Date()))){
      return 1;
    }
    if(fecha.isAfter(moment(new Date()))){
      return 0;
    }

    if(fecha.isBefore(moment(new Date()))){
      /*console.log("fecha a hoy:",moment(new Date()));
      console.log("fecha inicio",fecha);
      let testDiff = moment.duration(moment(new Date()).diff(fecha));
      console.log("diferencia as week",Math.round(testDiff.asWeeks()));
      console.log("diferencia",moment(new Date()).diff(fecha,'days'));*/
      return Math.floor((moment(new Date()).diff(fecha,'days')+1)/7)+1;
    }
  }
}
