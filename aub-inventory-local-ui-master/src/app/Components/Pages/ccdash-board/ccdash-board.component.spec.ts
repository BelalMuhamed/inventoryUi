import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCDashBoardComponent } from './ccdash-board.component';

describe('CCDashBoardComponent', () => {
  let component: CCDashBoardComponent;
  let fixture: ComponentFixture<CCDashBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CCDashBoardComponent]
    });
    fixture = TestBed.createComponent(CCDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
