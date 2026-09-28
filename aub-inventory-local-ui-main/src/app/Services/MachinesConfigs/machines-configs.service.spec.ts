import { TestBed } from '@angular/core/testing';

import { MachinesConfigsService } from './machines-configs.service';

describe('MachinesConfigsService', () => {
  let service: MachinesConfigsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachinesConfigsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
