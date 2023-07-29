import { Module } from '@nestjs/common';
import { EcommerceController } from './ecommerce.controller';
import { TokopediaService } from './services/tokopedia.service';
import { ShopeeService } from './services/shopee.service';
import { LazadaService } from './services/lazada.service';

@Module({
  imports: [],
  controllers: [EcommerceController],
  providers: [TokopediaService, ShopeeService, LazadaService],
})
export class EcommerceModule {}
