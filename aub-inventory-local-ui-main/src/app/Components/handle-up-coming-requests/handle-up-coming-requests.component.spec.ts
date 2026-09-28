import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleUpComingRequestsComponent } from './handle-up-coming-requests.component';

describe('HandleUpComingRequestsComponent', () => {
  let component: HandleUpComingRequestsComponent;
  let fixture: ComponentFixture<HandleUpComingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandleUpComingRequestsComponent]
    });
    fixture = TestBed.createComponent(HandleUpComingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
