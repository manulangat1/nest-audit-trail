import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateProductDTO } from './dto';
// import { User } from '../database/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AuditTrailService } from '../audit-trail/audit-trail.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private entityManager: EntityManager,
    private dataSource: DataSource,
    private authService: AuthService,
    private auditServie: AuditTrailService,
  ) {}

  async create(dto: CreateProductDTO, user: any) {
    const userExists = await this.authService.getUserById(user);
    console.log(userExists, 'userExists user', user);
    const product = await this.productRepo.create({
      ...dto,
      owner: userExists,
    });
    this.auditServie.create({
      description: `User creating a product`,
      user,
    });
    return await this.entityManager.save(product);
  }

  async getAll() {
    return await this.productRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: number) {
    return await this.productRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async delete(id: number) {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :id', { id: id })
      .execute();
  }
}
