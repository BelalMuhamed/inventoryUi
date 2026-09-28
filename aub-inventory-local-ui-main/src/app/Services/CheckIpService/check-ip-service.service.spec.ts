import { TestBed } from '@angular/core/testing';

import { CheckIpServiceService } from './check-ip-service.service';

describe('CheckIpServiceService', () => {
  let service: CheckIpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckIpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
