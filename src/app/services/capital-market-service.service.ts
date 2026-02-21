import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, shareReplay } from 'rxjs';
export interface CompanyInterface {
  name: string,
  symbol: string
}
interface CompanyResponse {
  data: CompanyInterface[];
}
export interface stockDetail {
  property: string,
  value: string,
  valuePrefix: string,
  valuePostfix: string,
}
export interface FinancialRatios {
  // Liquidity
  currentRatio: number | null;
  quickRatio: number | null;
  cashRatio: number | null;
  operatingCashFlowRatio: number | null;

  // Profitability
  grossMargin: number | null;
  operatingMargin: number | null;
  netProfitMargin: number | null;
  returnOnAssets: number | null;
  returnOnEquity: number | null;

  // Leverage
  debtToEquity: number | null;
  debtToAssets: number | null;
  interestCoverage: number | null;

  // Efficiency / Value
  assetTurnover: number | null;
  inventoryTurnover: number | null;
  freeCashFlowMargin: number | null;
}
export interface YearlyFinancialRatios {
  year: string;
  ratios: FinancialRatios;
}

export interface FinancialRatioResponse {
  latest: YearlyFinancialRatios;
  history: YearlyFinancialRatios[];
}

export interface Interval {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class CapitalMarketServiceService {
  private jsonUrl = 'all_nse_stocks.json'; // public folder and 'assets/stocks.json'; for assets folder
  private readonly baseUrl = 'http://localhost:8000/api/v1';
  // private readonly baseUrl = 'https://financial-dashboard-backend-w939.onrender.com/api/v1';
  private stockDetail: any | undefined = [];
  public stockData$: Observable<CompanyInterface[]>;
  _financialRatio!: FinancialRatioResponse;

  get financialRatio(): FinancialRatioResponse {
    return this._financialRatio;
  }

  constructor(private http: HttpClient) {
    this.stockData$ = this.http.get<CompanyResponse>(this.jsonUrl).pipe(
      map(res => res.data.map(c => ({ name: c.name, symbol: c.symbol }))),
      shareReplay(1) // ✅ cache the result, replay to new subscribers
    );
  }

  async getCurrentPriceAndPersentage(stockSymbol: string) {
    const endpoint = `/capitalmarket/stock/${stockSymbol}/currentPriceAndPersentage`;
    const response = await firstValueFrom(this.http.get<any>(`${this.baseUrl}${endpoint}`));
    if (!response.body.status) {
      throw new Error(response.body.message)
    }
    return response.body.data.fetched[0];
  }

  async getStockDetail(stockSymbol: string) {
    const endpoint = `/capitalmarket/stock/${stockSymbol}`;
    // Use any instead of any[]
    this.stockDetail = await firstValueFrom(this.http.get<any>(`${this.baseUrl}${endpoint}`));
  }

  getIntervals(): Observable<Interval[]> {
    const endpoint = `/capitalmarket/intervals`;
    return this.http.get<any>(`${this.baseUrl}${endpoint}`);
  }

  getStockPriceList(symbol: string | null,interval: string,fromdate: string,todate: string) {
    const endpoint = `/capitalmarket/stock/priceList`;
    const requestBody = {
      "symbol": symbol || 'HBLENGINE',
      "interval": interval || 'ONE_DAY',
      "fromDate": fromdate,
      "toDate": todate
    }
    return this.http.post<any>(`${this.baseUrl}${endpoint}`, requestBody);
  }

  getFinancialRatio(stockSymbol: string) {
    const endpoint = `/capitalmarket/stock/${stockSymbol}/financialRatio`;
    return this.http.get<any>(`${this.baseUrl}${endpoint}`);
  }

  getCompanyDescription(stockSymbol: string) {
    const endpoint = `/capitalmarket/stock/${stockSymbol}/description`;
    return this.http.get<any>(`${this.baseUrl}${endpoint}`);
  }

  getSimilarStock(stockSymbol: string) {
    const endpoint = `/capitalmarket/stock/${stockSymbol}/similar`;
    return this.http.get<any>(`${this.baseUrl}${endpoint}`);
  }
}
