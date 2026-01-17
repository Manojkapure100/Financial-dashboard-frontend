import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

export interface CompanyInterface {
  name: string,
  symbol: string
}

interface CompanyResponse {
  data: CompanyInterface[];
}

@Injectable({
  providedIn: 'root'
})
export class CapitalMarketServiceService {
  private jsonUrl = '/all_nse_stocks.json'; // public folder
  // private jsonUrl = 'assets/stocks.json'; // assets folder
  public stockData$: Observable<CompanyInterface[]>;
  
  constructor(private http: HttpClient) {
    this.stockData$ = this.http.get<CompanyResponse>(this.jsonUrl).pipe(
      map(res => res.data.map(c => ({ name: c.name, symbol: c.symbol }))),
      shareReplay(1) // ✅ cache the result, replay to new subscribers
    );
  }
}
