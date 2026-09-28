import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecivedTransactionCopmonentComponent } from './recived-transaction-copmonent.component';

describe('RecivedTransactionCopmonentComponent', () => {
  let component: RecivedTransactionCopmonentComponent;
  let fixture: ComponentFixture<RecivedTransactionCopmonentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecivedTransactionCopmonentComponent]
    });
    fixture = TestBed.createComponent(RecivedTransactionCopmonentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
