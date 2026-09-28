import { TestBed } from '@angular/core/testing';

import { SigmaServicesService } from './sigma-services.service';

describe('SigmaServicesService', () => {
  let service: SigmaServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigmaServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
