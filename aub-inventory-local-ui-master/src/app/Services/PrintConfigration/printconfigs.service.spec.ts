import { TestBed } from '@angular/core/testing';

import { PrintconfigsService } from './printconfigs.service';

describe('PrintconfigsService', () => {
  let service: PrintconfigsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintconfigsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
