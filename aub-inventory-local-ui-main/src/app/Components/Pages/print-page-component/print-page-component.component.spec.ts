import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPageComponentComponent } from './print-page-component.component';

describe('PrintPageComponentComponent', () => {
  let component: PrintPageComponentComponent;
  let fixture: ComponentFixture<PrintPageComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPageComponentComponent]
    });
    fixture = TestBed.createComponent(PrintPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
