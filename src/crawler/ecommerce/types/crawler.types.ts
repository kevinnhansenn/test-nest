export interface ProductResult {
  merchant: string;
  name?: string | null;
  price?: number | null;
  currency?: string | null;
  img_url?: string | null;
  external_link?: string | null;
}

export interface SearchResult {
  total: number;
  products: ProductResult[];
}

export interface SearchResponse {
  data: SearchResult;
}

export type ScrapperResponse = SearchResponse | { error: string };
