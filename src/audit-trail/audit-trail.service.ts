import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditTrail } from '../database/entities/audit.trail.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AuditTrailService {
  constructor(
    @InjectRepository(AuditTrail)
    private auditRepository: Repository<AuditTrail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private entityManager: EntityManager,
  ) {}

  async getUserRepository(user) {
    return await this.auditRepository.find({
      where: {
        user: user,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data) {
    console.log('my data', data);
    const newAuditTrail = await this.auditRepository.create({
      ...data,
    });
    return await this.entityManager.save(newAuditTrail);
  }
}
