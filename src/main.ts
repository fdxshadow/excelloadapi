import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { getConnection } from 'typeorm';
//import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(port);

  //const pass = await bcrypt.hash('77313388', 10);
  //usuario
  /*await getConnection()
    .query(
      `INSERT INTO usuarios (id,email,password,tipo) VALUES (1,'fran.peagonza@gmail.com','${pass}','administrador')`,
    )
    .then(() => {
      getConnection().query(
        "INSERT INTO administrador (id,nombre,usuarioId) VALUES (1,'Francisco',1)",
      );
    })
    .catch(() => {
      console.log('Usuario administrador ya existe');
    });*/
}
bootstrap();
