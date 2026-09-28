import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachineToUserComponent } from './add-machine-to-user.component';

describe('AddMachineToUserComponent', () => {
  let component: AddMachineToUserComponent;
  let fixture: ComponentFixture<AddMachineToUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMachineToUserComponent]
    });
    fixture = TestBed.createComponent(AddMachineToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
