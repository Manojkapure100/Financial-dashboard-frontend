import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-series-table',
  imports: [],
  templateUrl: './time-series-table.component.html',
  styleUrl: './time-series-table.component.scss'
})
export class TimeSeriesTableComponent {
  @Input() symbol: string | null = '';
  @Input() name!: string;

  constructor(){

  }
}
