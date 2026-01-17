import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { CapitalMarketServiceService } from '../../services/capital-market-service.service';
import { CompanyInterface } from '../../services/capital-market-service.service';

@Component({
  selector: 'app-homepage',
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  myControl = new FormControl('');
  companies$!: Observable<CompanyInterface[]>;
  filteredCompanies$: Observable<CompanyInterface[]>;

  constructor(
    private capitalMarketService: CapitalMarketServiceService
  ) {
    this.companies$ = this.capitalMarketService.stockData$;
    this.filteredCompanies$ = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filter(value || '')),
    );
  }

  onCompanySelected(event: MatAutocompleteSelectedEvent){
    console.log(event.option.value);
  }

  private _filter(value: string): Observable<CompanyInterface[]> {
    const filterValue = value.toLowerCase();
    return this.companies$.pipe(
      map(companies =>
        companies.filter(company =>
          company.name.toLowerCase().includes(filterValue) ||
          company.symbol.toLocaleLowerCase().includes(filterValue)
        ).slice(0,8) 
      )
    );
  }
}
