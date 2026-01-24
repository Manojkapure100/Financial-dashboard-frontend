import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalMarketServiceService } from '../../services/capital-market-service.service';
import { map, Observable, of } from 'rxjs';
import { StockchartComponent } from '../stockchart/stockchart.component';
import { ComparisonTableComponent } from '../comparison-table/comparison-table.component';
import { TimeSeriesTableComponent } from '../time-series-table/time-series-table.component';

interface stockDetail {
  property: string,
  value: string,
  valuePrefix: string,
  valuePostfix: string,
}

@Component({
  selector: 'app-detailpage',
  imports: [StockchartComponent, ComparisonTableComponent, TimeSeriesTableComponent],
  templateUrl: './detailpage.component.html',
  styleUrl: './detailpage.component.scss'
})
export class DetailpageComponent implements OnInit {
  chartOptions: any;
  symbol!: string | null;
  company!: string | null;
  companies$
  stockDetails: stockDetail[] = [
    {
      property: 'Market Value',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'Current price',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'P / E',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'Book value',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'Divident yield',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'Face value',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'ROCE',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
    {
      property: 'ROE',
      value: '12',
      valuePrefix: '$',
      valuePostfix: 'CR'
    },
  ];

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
    this.isParamValid(tempParam).subscribe(isValid => {
      if (!isValid) {
        this.router.navigate(['home']);
      }
      this.symbol = tempParam;
      this.updateContent();
    });
  }

  updateContent() {

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
