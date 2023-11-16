import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { AuditTrail } from './audit.trail.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  pkid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // this is the link to products
  // user.entity.ts file
  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @OneToMany(() => AuditTrail, (audittrail) => audittrail.user, {
    nullable: true,
  })
  auditTrails: AuditTrail[];

  @Column({
    type: Boolean,
    default: false,
  })
  isGoogleUser: boolean;
}
