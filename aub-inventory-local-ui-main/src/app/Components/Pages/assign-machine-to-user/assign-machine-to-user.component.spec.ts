import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMachineToUserComponent } from './assign-machine-to-user.component';

describe('AssignMachineToUserComponent', () => {
  let component: AssignMachineToUserComponent;
  let fixture: ComponentFixture<AssignMachineToUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignMachineToUserComponent]
    });
    fixture = TestBed.createComponent(AssignMachineToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
