import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrintConfigForProductPopupComponent } from './add-print-config-for-product-popup.component';

describe('AddPrintConfigForProductPopupComponent', () => {
  let component: AddPrintConfigForProductPopupComponent;
  let fixture: ComponentFixture<AddPrintConfigForProductPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPrintConfigForProductPopupComponent]
    });
    fixture = TestBed.createComponent(AddPrintConfigForProductPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
