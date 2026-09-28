import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrintConfigComponent } from './edit-print-config.component';

describe('EditPrintConfigComponent', () => {
  let component: EditPrintConfigComponent;
  let fixture: ComponentFixture<EditPrintConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPrintConfigComponent]
    });
    fixture = TestBed.createComponent(EditPrintConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
