import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EcommerceModule } from './crawler/ecommerce/ecommerce.module';

@Module({
  imports: [EcommerceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
