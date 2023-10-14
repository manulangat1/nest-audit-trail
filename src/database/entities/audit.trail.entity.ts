//  audit.trail.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  pkid: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.auditTrails)
  user: User;
}
