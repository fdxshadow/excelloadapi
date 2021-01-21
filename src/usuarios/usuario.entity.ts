import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  tipo: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  toResponseObject(showToken = false) {
    const { id, email, tipo } = this;
    const response = { id, email, tipo };
    if (showToken) {
      response['token'] = this.token;
    }
    return response;
  }

  async comparePassword(pass: string) {
    return await bcrypt.compare(pass, this.password);
  }

  private get token() {
    const { id, email, tipo } = this;
    return jwt.sign(
      {
        id,
        email,
        tipo,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
