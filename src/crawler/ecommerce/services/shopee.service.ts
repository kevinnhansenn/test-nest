import { Injectable } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Page } from 'puppeteer';
import {
  ProductResult,
  ScrapperResponse,
  SearchResult,
} from '../types/crawler.types';

@Injectable()
export class ShopeeService extends CrawlerService {
  constructor() {
    super({
      merchantId: 'shopee',
      baseUrl: 'https://shopee.co.id',
      debug: false,
    });
  }

  async evaluatePage(page: Page): Promise<SearchResult> {
    return page.evaluate(
      (baseUrl, merchant, currency) => {
        debugger;
        const results: ProductResult[] = [];

        // get all product elements
        const elements = document.querySelectorAll(
          'div.shopee-search-item-result__item',
        );

        // iterate over each product element
        elements.forEach((element) => {
          // ---

          // 1. Retrieve element ---
          const productNameEl = element.querySelector('div.Cve6sh');
          const productPriceEl = element.querySelector('div.hpDKMN');
          const productImageEl = element.querySelector('img');
          const productExternalLinkEl = element.querySelector('a');

          // 2. Prepare data ---
          let priceText = productPriceEl?.textContent || '';

          // if string is in the form of range, get the lhs (min)
          if (priceText.split('Rp').length === 3) {
            priceText = 'Rp' + priceText.split('Rp')[1];
          }
          // If price in a form of range, get the min
          if (priceText.includes('-')) {
            priceText = priceText.split(' - ')[0];
          }
          priceText = priceText.replace(/\./g, '').replace('Rp', '') || '0';

          // 3. Retrieve content ---
          const name = productNameEl?.textContent || '';
          const price = parseInt(priceText);
          const img_url = productImageEl?.getAttribute('src') || '';
          const external_link =
            baseUrl + productExternalLinkEl?.getAttribute('href') || '';

          // 4. Push to results ---
          results.push({
            merchant,
            currency,
            name,
            price,
            img_url,
            external_link,
          });
        });

        return { total: results.length, products: results };
      },
      this.baseUrl,
      this.merchantId,
      this.currency,
    );
  }

  async crawlProducts(q: string): Promise<ScrapperResponse> {
    return await this.crawl(async (page) => {
      // go to search page
      await page.goto(
        `${this.baseUrl}/search?keyword=${encodeURIComponent(q)}`,
      );

      // wait until page loaded
      await page.waitForNetworkIdle();

      // scroll to the middle
      await page.mouse.wheel({ deltaX: 1200 });

      // scroll down until bottom
      await this.scrollDown(page, 600, 8, 500);

      // evaluate the page
      const data: SearchResult = await this.evaluatePage(page);

      // return the data
      return this.resolveData(data);
    });
  }
}
