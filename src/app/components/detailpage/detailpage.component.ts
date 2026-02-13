import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalMarketServiceService, FinancialRatioResponse, stockDetail } from '../../services/capital-market-service.service';
import { map, Observable, of } from 'rxjs';
import { StockchartComponent } from '../stockchart/stockchart.component';
import { ComparisonTableComponent } from '../comparison-table/comparison-table.component';
// import { TimeSeriesTableComponent } from '../time-series-table/time-series-table.component';
import { KeyValuePipe, DecimalPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailpage',
  imports: [
    StockchartComponent, 
    ComparisonTableComponent, 
    KeyValuePipe,
    DecimalPipe,
    CommonModule
    // TimeSeriesTableComponent
  ],
  templateUrl: './detailpage.component.html',
  styleUrl: './detailpage.component.scss'
})
export class DetailpageComponent implements OnInit {
  chartOptions: any;
  symbol!: string | null;
  company!: string | null;
  companies$
  stockFinancialRatios!: FinancialRatioResponse;

  stockPrice = 0.00;
  stockChangeInPersantage = 0.00;
  stockChangeInValue = 0.00;

  stockData: any[] = [
    ['2026-01-01', 50],
    ['2026-01-02', 55],
    ['2026-01-03', 60],
    ['2026-01-04', 58],
    ['2026-01-05', 65],
    ['2026-01-06', 55],
    ['2026-01-07', 49],
    ['2026-01-08', 35],
    ['2026-01-09', 58],
    ['2026-01-10', 60]
  ];

  pros: string[] = [
    "Company is almost debt free",
    "Company is expected to give good quarter",
    "Company has delivered good profit growth of 64.6% CAGR over last 5 years"
  ];

  cons: string[] = [
    "Stock is trading at 9.86 times its book value"
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private capitalMarketService: CapitalMarketServiceService,
  ) {
    this.companies$ = this.capitalMarketService.stockData$;
    this.initialiseChart();
  }

  initialiseChart(){
    this.chartOptions = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'time', boundaryGap: false },
      yAxis: { type: 'value', scale: true },
      series: [
        {
          name: 'Stock Price',
          type: 'line',
          smooth: true,
          data: this.stockData
        }
      ],
      dataZoom: [{ type: 'inside' }, { type: 'slider' }]
    };
  }

  ngOnInit(): void {
    let tempParam = this.route.snapshot.paramMap.get('symbol');
    if(!tempParam){
      this.router.navigate(['home']);
      return;
    }
    
    this.isParamValid(tempParam).subscribe(async isValid => {
      if (!isValid) {
        this.router.navigate(['home']);
      }
      this.symbol = tempParam;
      await this.updateContent(this.symbol);
    });
  }
  
  async updateContent(symbol: string) {
    await this.getFinancialRatio(symbol);
    await this.getCurrentPriceAndPersantage(symbol);
  }

  async getCurrentPriceAndPersantage(symbol: string){
    const response = await this.capitalMarketService.getCurrentPriceAndPersantage(symbol);
    this.stockPrice = response.ltp;
    this.stockChangeInPersantage = response.percentChange;
    this.stockChangeInValue = response.netChange;
  }

  async getFinancialRatio(symbol: string) {
    await this.capitalMarketService.getFinancialRatio(symbol);
    this.stockFinancialRatios = this.capitalMarketService.financialRatio;
  }

  isParamValid(params: string | null): Observable<boolean> {
    return params
      ? this.isSymbolValid(params)
      : of(false);
  }

  isSymbolValid(inputtedSymbol: string): Observable<boolean> {
    return this.companies$.pipe(
      map(companies =>
        companies.some(company => {
          if (company.symbol.toLocaleLowerCase().includes(inputtedSymbol.toLowerCase())) {
            this.company = company.name;
            return true;
          } else {
            return false;
          }
        }
        )
      )
    );
  }

}
