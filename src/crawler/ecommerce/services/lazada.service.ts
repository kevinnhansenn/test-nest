import { Injectable } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Page } from 'puppeteer';
import {
  ProductResult,
  ScrapperResponse,
  SearchResult,
} from '../types/crawler.types';

@Injectable()
export class LazadaService extends CrawlerService {
  constructor() {
    super({
      merchantId: 'lazada',
      baseUrl: 'https://lazada.co.id',
      debug: false,
    });
  }

  async evaluatePage(page: Page): Promise<SearchResult> {
    return page.evaluate(
      (merchant, currency) => {
        debugger;
        const results: ProductResult[] = [];

        // get all product elements
        const elements = document.querySelectorAll('div.qmXQo');

        // loop through all product elements
        elements.forEach((element) => {
          // ---

          // 1. Retrieve element ---
          const productNameEl = element.querySelector('div.RfADt');
          const productPriceEl = element.querySelector('div.aBrP0');
          const productImageEl = element.querySelector('img');
          const productExternalLinkEl = element.querySelector('a');

          // 2. Prepare data ---
          const priceText =
            productPriceEl?.textContent?.replace(/\./g, '').replace('Rp', '') ||
            '0';

          // 3. Retrieve content ---
          const name = productNameEl?.textContent || '';
          const price = parseInt(priceText);
          const img_url = productImageEl?.getAttribute('src') || '';
          const external_link =
            'https:' + productExternalLinkEl?.getAttribute('href') || '';

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

        return {
          total: results.length,
          products: results,
        };
      },
      this.merchantId,
      this.currency,
    );
  }

  async crawlProducts(q: string): Promise<ScrapperResponse> {
    return await this.crawl(async (page) => {
      // go to search page
      await page.goto(
        `${this.baseUrl}/catalog?q=${encodeURIComponent(
          q,
        )}&catalog_redirect_tag=false&_keyori=ss&from=input&spm=..search.go.`,
        {
          waitUntil: 'domcontentloaded',
        },
      );

      // delay 3 seconds
      await page.waitForTimeout(3000);

      // scroll down until bottom
      await this.scrollDown(page, 600, 8, 500);

      // evaluate the page
      const data: SearchResult = await this.evaluatePage(page);

      // return the data
      return this.resolveData(data);
    });
  }
}
