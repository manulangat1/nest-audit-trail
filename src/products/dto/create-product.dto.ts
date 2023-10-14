import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  price: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  discount_price: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  url: string;
}
