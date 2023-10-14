import { Controller, Get } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';
import { GetUser } from '../common/decorators';

@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  @Get('')
  async getUserTrail(@GetUser() user: any) {
    return this.auditTrailService.getUserRepository(user);
  }
}
