import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchRepuestDetailsPopupComponent } from './branch-repuest-details-popup.component';

describe('BranchRepuestDetailsPopupComponent', () => {
  let component: BranchRepuestDetailsPopupComponent;
  let fixture: ComponentFixture<BranchRepuestDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchRepuestDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(BranchRepuestDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
