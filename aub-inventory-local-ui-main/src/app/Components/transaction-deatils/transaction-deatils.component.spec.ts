import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDeatilsComponent } from './transaction-deatils.component';

describe('TransactionDeatilsComponent', () => {
  let component: TransactionDeatilsComponent;
  let fixture: ComponentFixture<TransactionDeatilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionDeatilsComponent]
    });
    fixture = TestBed.createComponent(TransactionDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
