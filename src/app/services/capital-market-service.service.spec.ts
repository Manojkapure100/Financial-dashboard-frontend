import { TestBed } from '@angular/core/testing';

import { CapitalMarketServiceService } from './capital-market-service.service';

describe('CapitalMarketServiceService', () => {
  let service: CapitalMarketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalMarketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
