import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '../../services/spinner.service';

/**
 * FullScreenSpinnerComponent - Material-based full-screen loading spinner
 * 
 * This component displays a Material spinner that covers the entire screen.
 * It automatically shows/hides based on SpinnerService state.
 * 
 * Usage in app.component.html:
 * <app-full-screen-spinner></app-full-screen-spinner>
 */
@Component({
    selector: 'app-full-screen-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
    <div class="spinner-overlay" *ngIf="isLoading$ | async">
      <div class="spinner-container">
        <mat-spinner 
          [diameter]="diameter" 
          [strokeWidth]="strokeWidth">
        </mat-spinner>
        <p class="spinner-text" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
    styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spinner-text {
      margin-top: 20px;
      font-size: 16px;
      color: #666;
      text-align: center;
      font-weight: 500;
    }

    @media (max-width: 600px) {
      .spinner-container {
        padding: 30px;
      }

      .spinner-text {
        font-size: 14px;
      }
    }
  `]
})
export class FullScreenSpinnerComponent implements OnInit, OnDestroy {
    isLoading$: Observable<boolean>;
    // Customizable spinner properties
    diameter = 60;
    strokeWidth = 4;
    message = 'Loading, please wait...';

    private destroy$ = new Subject<void>();

    constructor(private spinnerService: SpinnerService) {
        this.isLoading$ = this.spinnerService.isLoading$;
    }

    ngOnInit(): void {
        // Component automatically subscribes to loading state via async pipe
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Update spinner display message
     */
    setMessage(message: string): void {
        this.message = message;
    }

    /**
     * Configure spinner appearance
     */
    configure(diameter?: number, strokeWidth?: number, message?: string): void {
        if (diameter) this.diameter = diameter;
        if (strokeWidth) this.strokeWidth = strokeWidth;
        if (message) this.message = message;
    }
}
