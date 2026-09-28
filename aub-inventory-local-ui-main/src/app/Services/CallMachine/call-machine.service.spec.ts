import { TestBed } from '@angular/core/testing';

import { CallMAchineService } from './call-machine.service';

describe('CallMAchineService', () => {
  let service: CallMAchineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallMAchineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
