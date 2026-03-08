export type MarketType = 'CURVE' | 'DEX';

export interface IToken {
  address: string;
  name: string;
  ticker: string;
  price: number;
  market_cap: number;
  holders: number;
  market_type: MarketType;
  logo?: string;
  project_id?: string;
  total_supply?: number;
  created_at?: string;
}
