import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../database/entities/user.entity';

export class AuditTrailDTO {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  user?: User;
}
