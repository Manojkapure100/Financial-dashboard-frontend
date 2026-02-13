import { Component } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';

// Import only line chart, tooltip, grid, time axis
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

// Register the parts you need
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
      useValue: { echarts }  // <-- provide the ECharts instance
    }
  ]
})
export class StockchartComponent {

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

  ) {
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

}
