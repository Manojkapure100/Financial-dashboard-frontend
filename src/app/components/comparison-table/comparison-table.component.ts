import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comparison-table',
  imports: [],
  templateUrl: './comparison-table.component.html',
  styleUrl: './comparison-table.component.scss'
})
export class ComparisonTableComponent {
  @Input() symbol: string | null = '';

  constructor(){
    
  }
}
