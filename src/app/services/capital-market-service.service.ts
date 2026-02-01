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

@Injectable({
  providedIn: 'root'
})
export class CapitalMarketServiceService {
  private jsonUrl = 'all_nse_stocks.json'; // public folder and 'assets/stocks.json'; for assets folder
  private readonly baseUrl = 'http://localhost:8000/api/v1';
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

  async getStockDetail(stockSymbol: string) {
    const endpoint = `/capitalmarket/company/${stockSymbol}`;
    // Use any instead of any[]
    this.stockDetail = await firstValueFrom(this.http.get<any>(`${this.baseUrl}${endpoint}`));
  }

  async getFinancialRatio(stockSymbol: string) {
    await this.getStockDetail(stockSymbol);
    if (this.stockDetail && this.stockDetail.data.Info.financials.length > 0) {
      const all = this.stockDetail.data.Info.financials
        .sort((a: any, b: any) => Number(b.FiscalYear) - Number(a.FiscalYear))
        .map((f: any) => ({
          year: f.FiscalYear,
          ratios: this.calculateRatios(f)
        }));

      this._financialRatio = {
        latest: all[0],
        history: all.slice(0, 5).reverse()
      };
    } else {
      console.error('No financial data available.');
    }
  }

  private getValue(
    arr: any[],
    key: string
  ): number | null {
    const item = arr?.find(x => x.key === key);
    return item ? Number(item.value) : null;
  }

  private calculateRatios(financial: any): FinancialRatios {
    const BAL = financial.stockFinancialMap.BAL;
    const INC = financial.stockFinancialMap.INC;
    const CAS = financial.stockFinancialMap.CAS;

    const totalCurrentAssets = this.getValue(BAL, "TotalCurrentAssets");
    const totalCurrentLiabilities = this.getValue(BAL, "TotalCurrentLiabilities");
    const inventory = this.getValue(BAL, "TotalInventory");
    const cash = this.getValue(BAL, "Cash");
    const cashEq = this.getValue(BAL, "CashEquivalents");
    const shortInv = this.getValue(BAL, "ShortTermInvestments");
    const totalAssets = this.getValue(BAL, "TotalAssets");
    const totalEquity = this.getValue(BAL, "TotalEquity");
    const totalDebt = this.getValue(BAL, "TotalDebt");

    const revenue = this.getValue(INC, "TotalRevenue");
    const grossProfit = this.getValue(INC, "GrossProfit");
    const operatingIncome = this.getValue(INC, "OperatingIncome");
    const netIncome = this.getValue(INC, "NetIncome");
    const interestExp = this.getValue(INC, "InterestInc(Exp)Net-Non-OpTotal");

    const operatingCashFlow = this.getValue(CAS, "CashfromOperatingActivities");
    const capex = this.getValue(CAS, "CapitalExpenditures");

    return {
      // Liquidity
      currentRatio:
        totalCurrentAssets && totalCurrentLiabilities
          ? totalCurrentAssets / totalCurrentLiabilities
          : null,

      quickRatio:
        totalCurrentAssets && inventory && totalCurrentLiabilities
          ? (totalCurrentAssets - inventory) / totalCurrentLiabilities
          : null,

      cashRatio:
        cash && cashEq && shortInv && totalCurrentLiabilities
          ? (cash + cashEq + shortInv) / totalCurrentLiabilities
          : null,

      operatingCashFlowRatio:
        operatingCashFlow && totalCurrentLiabilities
          ? operatingCashFlow / totalCurrentLiabilities
          : null,

      // Profitability
      grossMargin:
        grossProfit && revenue ? grossProfit / revenue : null,

      operatingMargin:
        operatingIncome && revenue ? operatingIncome / revenue : null,

      netProfitMargin:
        netIncome && revenue ? netIncome / revenue : null,

      returnOnAssets:
        netIncome && totalAssets ? netIncome / totalAssets : null,

      returnOnEquity:
        netIncome && totalEquity ? netIncome / totalEquity : null,

      // Leverage
      debtToEquity:
        totalDebt && totalEquity ? totalDebt / totalEquity : null,

      debtToAssets:
        totalDebt && totalAssets ? totalDebt / totalAssets : null,

      interestCoverage:
        operatingIncome && interestExp
          ? operatingIncome / Math.abs(interestExp)
          : null,

      // Efficiency / Value
      assetTurnover:
        revenue && totalAssets ? revenue / totalAssets : null,

      inventoryTurnover:
        revenue && inventory ? revenue / inventory : null,

      freeCashFlowMargin:
        operatingCashFlow && capex && revenue
          ? (operatingCashFlow - Math.abs(capex)) / revenue
          : null
    };
  }
}
