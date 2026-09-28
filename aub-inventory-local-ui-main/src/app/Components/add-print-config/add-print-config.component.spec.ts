import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrintConfigComponent } from './add-print-config.component';

describe('AddPrintConfigComponent', () => {
  let component: AddPrintConfigComponent;
  let fixture: ComponentFixture<AddPrintConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPrintConfigComponent]
    });
    fixture = TestBed.createComponent(AddPrintConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
