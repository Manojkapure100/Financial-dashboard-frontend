import { Component, Input, OnInit } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import {
  CandlestickChart, BarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  DatasetComponent,
  ToolboxComponent,
  VisualMapComponent,
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { CapitalMarketServiceService, Interval } from '../../services/capital-market-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

echarts.use([
  DatasetComponent,
  ToolboxComponent,
  VisualMapComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  CanvasRenderer,
  CandlestickChart,
  BarChart
]);

export interface stockData {
  timestamp: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
};

export interface getStockPriceListRequest {
  symbol: string | null,
  interval: string,
  fromDate: string,
  toDate: string
}

@Component({
  selector: 'app-stockchart',
  imports: [NgxEchartsDirective, MatFormFieldModule, MatSelectModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stockchart.component.html',
  styleUrl: './stockchart.component.scss',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    }
  ],
})
export class StockchartComponent implements OnInit {
  @Input() symbol!: string | null;
  selectedInterval!: string

  intervals!: string[]
  chartOptions: any;
  updateOption: any;
  stockData: stockData[] = [];

  readonly range!: FormGroup;

  constructor(
    private capitalMarketService: CapitalMarketServiceService
  ) {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.range = new FormGroup({
      fromDate: new FormControl<Date>(thirtyDaysAgo),
      toDate: new FormControl<Date>(today),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadIntervals();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  getStockPriceList() {
    const request: getStockPriceListRequest = {
      symbol: this.symbol,
      interval: this.selectedInterval,
      fromDate: this.formatDate(this.range.controls['fromDate'].value),
      toDate: this.formatDate(this.range.controls['toDate'].value)
    }

    this.capitalMarketService.getStockPriceList(request.symbol, request.interval, request.fromDate, request.toDate).subscribe(
      (response) => {
        this.updateChart(response.body.data);
      },
      (error) => console.error('Error fetching stock prices:', error)
    );
  }

  updateChart(data: any[]) {
    this.updateOption = {
      dataset: {
        source: data
      }
    };
  }

  async loadChart() {
    const downColor = '#ec0000';
    const downBorderColor = '#8A0000';
    const upColor = '#00da3c';
    const upBorderColor = '#008F28';

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          }
        }
      },
      grid: [
        {
          left: '10%',
          right: '10%',
          bottom: 200
        },
        {
          left: '10%',
          right: '10%',
          height: 80,
          bottom: 80
        }
      ],

      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: false }
        },
        {
          type: 'time',
          gridIndex: 1,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          axisLabel: { show: false }
        }
      ],

      yAxis: [
        {
          scale: true
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],

      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1]
        },
        {
          type: 'slider',
          xAxisIndex: [0, 1]
        }
      ],

      series: [
        {
          name: 'Candlestick',
          type: 'candlestick',
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor
          },
          encode: {
            x: 0,
            y: [1, 4, 3, 2] // [open, close, low, high] expected by echart
          }
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          encode: {
            x: 0,
            y: 5
          }
        }
      ]
    };
  }

  async loadIntervals() {
    this.capitalMarketService.getIntervals().subscribe(
      (data: any) => {
        if (data.body && data.body.intervals) {
          this.intervals = data.body.intervals.map((i: any) => i.name);
          this.selectedInterval = this.intervals[this.intervals.length - 1];
          this.loadChart();
          this.getStockPriceList();
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
