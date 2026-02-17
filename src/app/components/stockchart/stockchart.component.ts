import { Component, Input, OnInit } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import {
  LineChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { CapitalMarketServiceService, Interval } from '../../services/capital-market-service.service';

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  CanvasRenderer
]);

@Component({
  selector: 'app-stockchart',
  imports: [NgxEchartsDirective],
  templateUrl: './stockchart.component.html',
  styleUrl: './stockchart.component.scss',
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    }
  ]
})
export class StockchartComponent implements OnInit {
  @Input() symbol!: string | null;

  intervals!: string[]
  selectedInterval!: string
  chartOptions: any;
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

  constructor(
    private capitalMarketService: CapitalMarketServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      await this.fetchChartByDefaultValue()
      this.loadContent()
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  async fetchChartByDefaultValue() {
    await this.loadIntervals()
    let toDate = new Date();
    let fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
    const request = {
      "symbol": this.symbol,
      "interval": this.selectedInterval,
      "fromDate": this.formatDate(fromDate),
      "toDate": this.formatDate(toDate)
    }
    this.capitalMarketService.getStockPriceList(request.symbol, request.interval, request.fromDate, request.toDate).subscribe(
      (response) => {
        this.handleStockData(response.body.data);
      },
      (error) => console.error('Error fetching stock prices:', error)
    );
  }

  async loadContent() {
    await this.loadChart()
  }

  handleStockData(data: any[]) {
    this.stockData = [];
    data.forEach(e=>{
      this.stockData.push([e[0], e[1]])
    });
    this.loadChart();
  }

  async loadChart() {
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

  async loadIntervals() {
    this.capitalMarketService.getIntervals().subscribe(
      (data: any) => {
        if (data.body && data.body.intervals) {
          this.intervals = data.body.intervals.map((i: any) => i.name);
          this.selectedInterval = this.intervals[this.intervals.length - 1];
        } else {
          this.intervals = [];
          this.selectedInterval = ''
        }
      },
      (error) => {
        console.error('Error fetching intervals:', error);
      }
    );
  }

}
