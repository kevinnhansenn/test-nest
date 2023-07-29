import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
import { ScrapperResponse, SearchResult } from '../types/crawler.types';

const plugin = StealthPlugin();
puppeteer.use(plugin);

interface Config {
  merchantId: string;
  baseUrl: string;
  debug?: boolean;
  currency?: string;
}

export abstract class CrawlerService {
  protected merchantId: string;
  protected baseUrl: string;
  protected debug: boolean;
  protected currency: string;

  abstract evaluatePage(page: Page): Promise<SearchResult>;
  abstract crawlProducts(query: string): Promise<ScrapperResponse>;

  protected constructor(config: Config) {
    this.merchantId = config.merchantId;
    this.baseUrl = config.baseUrl;
    this.debug = config.debug || false;
    this.currency = config.currency || 'Rp';
  }

  protected async crawl(
    exec: (page: Page) => Promise<any>,
  ): Promise<ScrapperResponse> {
    // Launch a new browser
    const browser = await puppeteer.launch({
      headless: this.debug ? false : 'new',
      devtools: this.debug,
    });

    // Create a new page
    const page = await browser.newPage();

    // Set viewport to 1280x800
    await page.setViewport({ width: 1280, height: 800 });

    // Execute the function
    const result = await exec(page);

    // Close the browser
    await browser.close();

    // Return the result
    return result;
  }

  protected async scrollDown(
    page: Page,
    px: number,
    scrollNum: number,
    delay: number,
  ) {
    for (let i = 0; i < scrollNum; i++) {
      await page.mouse.wheel({ deltaY: px });
      await page.waitForTimeout(delay);
    }
  }

  protected resolveData(data: SearchResult): ScrapperResponse {
    if (!data.total) {
      return {
        error: `[${this.merchantId}] Failed to scrape`,
      };
    }

    return {
      data,
    };
  }
}
