import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { SemanasEntity } from './semanas.entity';
import { TareaEntity } from './tarea.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(TareaEntity)
    private tareasRepository: Repository<TareaEntity>,
    @InjectRepository(SemanasEntity)
    private semanaRepository: Repository<SemanasEntity>
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

  async getTareasByArea(area:string,id_usuario){
    const areas = await createQueryBuilder('planificacion','p')
    .select("t.*")
    .innerJoin("obras","o","p.obra=o.id")
    .innerJoin("supervisor","s","s.obra=o.id")
    .innerJoin("tareas","t","p.id=t.planificacion")
    .where(`s.usuarioId = ${id_usuario}`)
    .andWhere(`t.area_responsable='${area}'`)
    .getRawMany();
    return areas;

  }

  async getSemanasByTarea(tarea_id:number){
    const semana = await this.semanaRepository.find({select:['id','semana','trabajo_efectivo'],where:{tarea:tarea_id}});
    return semana;
  }

  async updatePorcAvanceSem(semana){
    if(semana['id']!=null){
      const semanaDb = await this.semanaRepository.findOne({where:{id:semana['id']}});
      semanaDb.trabajo_efectivo = semana['trabajo_efectivo'];
      return await this.semanaRepository.save(semanaDb);
    }else{
      const atraso = this.semanaRepository.create({semana: semana['semana'],trabajo_efectivo:semana['trabajo_efectivo'],tarea:semana['tarea_id'],carga_trabajo:100});
      return this.semanaRepository.save(atraso);
    }
  }
}
