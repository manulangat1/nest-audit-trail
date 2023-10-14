import { Module } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';
import { AuditTrailController } from './audit-trail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { AuditTrail } from '../database/entities/audit.trail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuditTrail])],
  controllers: [AuditTrailController],
  providers: [AuditTrailService],
  exports: [AuditTrailService],
})
export class AuditTrailModule {}
