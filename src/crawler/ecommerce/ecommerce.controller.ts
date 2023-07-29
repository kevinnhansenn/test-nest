import { Controller, Get, Query } from '@nestjs/common';
import { TokopediaService } from './services/tokopedia.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ShopeeService } from './services/shopee.service';
import { LazadaService } from './services/lazada.service';

@ApiTags('E-Commerce')
@ApiSecurity('access-key')
@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly tokopediaSvc: TokopediaService,
    private readonly shopeeSvc: ShopeeService,
    private readonly lazadaSvc: LazadaService,
  ) {}

  @Get('tokopedia')
  async tokopedia(@Query('q') q: string) {
    return this.tokopediaSvc.crawlProducts(q);
  }

  @Get('shopee')
  async shopee(@Query('q') q: string) {
    return this.shopeeSvc.crawlProducts(q);
  }

  @Get('lazada')
  async lazada(@Query('q') q: string) {
    return this.lazadaSvc.crawlProducts(q);
  }
}
