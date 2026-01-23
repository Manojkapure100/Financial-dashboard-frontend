import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalMarketServiceService } from '../../services/capital-market-service.service';
import { map, Observable, of } from 'rxjs';

interface stockDetail {
  property: string,
  value: string,
  valuePrefix: string,
  valuePostfix: string,
}

@Component({
  selector: 'app-detailpage',
  imports: [],
  templateUrl: './detailpage.component.html',
  styleUrl: './detailpage.component.scss'
})
export class DetailpageComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private capitalMarketService: CapitalMarketServiceService,
  ) {
    this.companies$ = this.capitalMarketService.stockData$;
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
