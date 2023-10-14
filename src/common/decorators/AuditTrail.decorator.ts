import { CustomDecorator, SetMetadata } from '@nestjs/common';

const AUDIT_TRAIL_DESCRIPTION = 'AUDIT_TRAIL_DESCRIPTION';

export const AuditTrailDecorator = (description): CustomDecorator =>
  SetMetadata(AUDIT_TRAIL_DESCRIPTION, description);
