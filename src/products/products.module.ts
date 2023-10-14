import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { AuditTrailModule } from '../audit-trail/audit-trail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, AuditTrailModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
