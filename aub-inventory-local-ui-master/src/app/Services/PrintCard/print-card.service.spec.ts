import { TestBed } from '@angular/core/testing';

import { PrintCardService } from './print-card.service';

describe('PrintCardService', () => {
  let service: PrintCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
