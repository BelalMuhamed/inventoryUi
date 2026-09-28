import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCardHolderNameComponent } from './print-card-holder-name.component';

describe('PrintCardHolderNameComponent', () => {
  let component: PrintCardHolderNameComponent;
  let fixture: ComponentFixture<PrintCardHolderNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintCardHolderNameComponent]
    });
    fixture = TestBed.createComponent(PrintCardHolderNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
