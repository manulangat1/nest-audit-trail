import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditTrailDecorator, GetUser } from '../common/decorators';
// import { User } from '../database/entities/user.entity';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  private logger = new Logger('Products');
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'This api  gets all the products',
  })
  @AuditTrailDecorator('Fetch all products')
  async getAll() {
    return await this.productsService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'This api creates a  product',
  })
  async create(@Body() dto: CreateProductDTO, @GetUser() user: any) {
    this.logger.log(`Creating a product for user ${user}`);
    return await this.productsService.create(dto, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'This api  gets all  product by id',
  })
  async getById(@Param('id') id: number) {
    return await this.productsService.getById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'This api  deletes a product by Id',
  })
  async delete(@Param('id') id: number) {
    return await this.productsService.delete(id);
  }
}
