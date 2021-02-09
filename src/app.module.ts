import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasModule } from './empresas/empresas.module';
import { ObrasModule } from './obras/obras.module';
import { GerentesModule } from './gerentes/gerentes.module';
import { AdministradorModule } from './administrador/administrador.module';
import { TareasModule } from './tareas/tareas.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { PlanificacionModule } from './planificacion/planificacion.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EmpresasModule,
    ObrasModule,
    GerentesModule,
    AdministradorModule,
    TareasModule,
    SupervisorModule,
    UsuariosModule,
    PlanificacionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
