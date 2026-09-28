import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfigComponent } from './print-config.component';

describe('PrintConfigComponent', () => {
  let component: PrintConfigComponent;
  let fixture: ComponentFixture<PrintConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintConfigComponent]
    });
    fixture = TestBed.createComponent(PrintConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
