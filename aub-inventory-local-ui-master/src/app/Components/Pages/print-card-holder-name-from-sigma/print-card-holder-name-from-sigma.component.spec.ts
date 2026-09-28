import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCardHolderNameFromSigmaComponent } from './print-card-holder-name-from-sigma.component';

describe('PrintCardHolderNameFromSigmaComponent', () => {
  let component: PrintCardHolderNameFromSigmaComponent;
  let fixture: ComponentFixture<PrintCardHolderNameFromSigmaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintCardHolderNameFromSigmaComponent]
    });
    fixture = TestBed.createComponent(PrintCardHolderNameFromSigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
