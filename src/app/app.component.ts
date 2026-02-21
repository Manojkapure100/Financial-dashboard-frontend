import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullScreenSpinnerComponent } from './components/full-screen-spinner/full-screen-spinner.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FullScreenSpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Financial-dashboard-frontend';
}
