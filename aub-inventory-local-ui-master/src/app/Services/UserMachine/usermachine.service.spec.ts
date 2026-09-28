import { TestBed } from '@angular/core/testing';

import { UsermachineService } from './usermachine.service';

describe('UsermachineService', () => {
  let service: UsermachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
