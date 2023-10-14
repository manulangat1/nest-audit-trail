import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { AuditTrailService } from '../../audit-trail/audit-trail.service';

import { AuthService } from '../../auth/auth.service';
import { Reflector } from '@nestjs/core';

const AUDIT_TRAIL_DESCRIPTION = 'AUDIT_TRAIL_DESCRIPTION';
@Injectable()
export class AuditTrailInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditTrailService,
    private userService: AuthService,
    private reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const description = this.reflector.getAllAndOverride<boolean>(
      AUDIT_TRAIL_DESCRIPTION,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap(async () => {
        if (user) {
          const userExists = await this.userService.getUserById(user.sub);
          await this.auditService.create({
            user: userExists,
            description: description ? description : 'Desc not specified',
          });
        }
      }),
    );
  }
}
