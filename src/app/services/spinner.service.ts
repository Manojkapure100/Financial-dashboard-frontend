import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * SpinnerService - Manages application-wide loading spinner state
 * 
 * This service follows the singleton pattern and uses RxJS BehaviorSubject
 * to manage the spinner visibility state across the entire application.
 * 
 * Usage:
 * - Inject into your component or interceptor
 * - Call start() to show the spinner
 * - Call end() to hide the spinner
 * 
 * Example:
 * constructor(private spinnerService: SpinnerService) {}
 * 
 * ngOnInit() {
 *   this.spinnerService.start();
 *   this.spinnerService.isLoading$.subscribe(isLoading => {
 *     console.log('Spinner is loading:', isLoading);
 *   });
 * }
 * 
 * onDataFetch() {
 *   this.spinnerService.end();
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * Observable stream of loading state
   * Components can subscribe to this to react to spinner visibility changes
   */
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Counter to handle nested loading states
   * Useful when multiple async operations need to show spinner simultaneously
   */
  private requestCounter: number = 0;

  constructor() {}

  /**
   * Start showing the full-screen spinner
   * 
   * Increments the request counter to support nested operations.
   * The spinner will remain visible until all operations call end().
   */
  start(): void {
    this.requestCounter++;
    if (this.requestCounter === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Stop showing the full-screen spinner
   * 
   * Decrements the request counter. The spinner will only hide
   * when the counter reaches 0, allowing nested operations to work correctly.
   */
  end(): void {
    if (this.requestCounter > 0) {
      this.requestCounter--;
      if (this.requestCounter === 0) {
        this.loadingSubject.next(false);
      }
    }
  }

  /**
   * Force stop the spinner immediately
   * Resets the counter and hides the spinner regardless of pending operations
   * 
   * Use with caution - should only be called in error scenarios
   */
  forceStop(): void {
    this.requestCounter = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Get current loading state synchronously
   * 
   * @returns boolean indicating if spinner is currently visible
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Get current request counter
   * Useful for debugging and monitoring nested operations
   * 
   * @returns number of pending operations
   */
  getRequestCount(): number {
    return this.requestCounter;
  }
}
