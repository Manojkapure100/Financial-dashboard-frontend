import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullScreenSpinnerComponent } from './full-screen-spinner.component';
import { SpinnerService } from '../../services/spinner.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('FullScreenSpinnerComponent', () => {
  let component: FullScreenSpinnerComponent;
  let fixture: ComponentFixture<FullScreenSpinnerComponent>;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenSpinnerComponent, MatProgressSpinnerModule],
      providers: [SpinnerService]
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenSpinnerComponent);
    component = fixture.componentInstance;
    spinnerService = TestBed.inject(SpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner when loading', (done) => {
    spinnerService.start();
    fixture.detectChanges();

    setTimeout(() => {
      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeTruthy();
      done();
    }, 100);
  });

  it('should hide spinner when not loading', (done) => {
    spinnerService.end();
    fixture.detectChanges();

    setTimeout(() => {
      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeFalsy();
      done();
    }, 100);
  });

  it('should display message when set', () => {
    component.setMessage('Loading data...');
    fixture.detectChanges();

    expect(component.message).toBe('Loading data...');
  });

  it('should configure spinner properties', () => {
    component.configure(80, 5, 'Please wait...');
    
    expect(component.diameter).toBe(80);
    expect(component.strokeWidth).toBe(5);
    expect(component.message).toBe('Please wait...');
  });
});
