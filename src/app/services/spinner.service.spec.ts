import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start spinner', (done) => {
    service.start();
    service.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        expect(isLoading).toBe(true);
        done();
      }
    });
  });

  it('should end spinner', (done) => {
    service.start();
    service.end();
    service.isLoading$.subscribe(isLoading => {
      if (!isLoading) {
        expect(isLoading).toBe(false);
        done();
      }
    });
  });

  it('should handle nested start/end calls correctly', (done) => {
    service.start(); // counter = 1
    service.start(); // counter = 2
    service.end();   // counter = 1
    
    let isStillLoading = false;
    service.isLoading$.subscribe(isLoading => {
      isStillLoading = isLoading;
    });

    setTimeout(() => {
      // Should still be loading after first end()
      expect(isStillLoading).toBe(true);
      expect(service.getRequestCount()).toBe(1);
      
      service.end(); // counter = 0
      
      setTimeout(() => {
        expect(service.isLoading()).toBe(false);
        expect(service.getRequestCount()).toBe(0);
        done();
      }, 100);
    }, 100);
  });

  it('should force stop spinner immediately', (done) => {
    service.start();
    service.start();
    service.forceStop();

    expect(service.isLoading()).toBe(false);
    expect(service.getRequestCount()).toBe(0);
    done();
  });

  it('should return correct loading state synchronously', () => {
    expect(service.isLoading()).toBe(false);
    
    service.start();
    expect(service.isLoading()).toBe(true);
    
    service.end();
    expect(service.isLoading()).toBe(false);
  });

  it('should track request count correctly', () => {
    expect(service.getRequestCount()).toBe(0);
    
    service.start();
    expect(service.getRequestCount()).toBe(1);
    
    service.start();
    expect(service.getRequestCount()).toBe(2);
    
    service.end();
    expect(service.getRequestCount()).toBe(1);
    
    service.end();
    expect(service.getRequestCount()).toBe(0);
  });

  it('should not go negative on extra end calls', () => {
    service.start();
    service.end();
    service.end();
    service.end();
    
    expect(service.getRequestCount()).toBe(0);
    expect(service.isLoading()).toBe(false);
  });
});
