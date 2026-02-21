import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CapitalMarketServiceService } from '../../services/capital-market-service.service';

export interface SimilarStock {
  symbol: string;
  companyName: string;
  price: number;
  mktCap: number;
}

@Component({
  selector: 'app-comparison-table',
  imports: [CdkDropList, CdkDrag, MatTableModule, MatIconModule],
  templateUrl: './comparison-table.component.html',
  styleUrl: './comparison-table.component.scss'
})
export class ComparisonTableComponent implements OnInit {
  _symbol: string | null = null;
  @Input() name!: string;
  
  @Input()
  set symbol(value: string | null) {
    this._symbol = value;
    if (value) {
      console.log("Value changed", value);
      this.getSimilarStock();
    }
  }

  similarStocks!: any[];

  @ViewChild('table', { static: true }) table!: MatTable<SimilarStock>;

  displayedColumns: string[] = ['symbol', 'companyName', 'price', 'mktCap'];
  dataSource!: SimilarStock[];

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.findIndex(d => d === event.item.data);
    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  constructor(
    private capitalMarketService: CapitalMarketServiceService
  ) {}

  ngOnInit(): void {
    //
  }

  handleResponse(resp: SimilarStock[]){
    resp = resp.filter(stock=> stock.symbol.includes('.NS'));
    this.dataSource = resp;
  }

  getSimilarStock() {
    if(this._symbol){
      this.capitalMarketService.getSimilarStock(this._symbol).subscribe((resp) => {
        this.handleResponse(resp.body);
      });
    } else {
      console.log("not found");
    }
  }
}
