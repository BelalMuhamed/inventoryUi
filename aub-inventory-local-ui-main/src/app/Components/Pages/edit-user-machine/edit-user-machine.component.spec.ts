import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserMachineComponent } from './edit-user-machine.component';

describe('EditUserMachineComponent', () => {
  let component: EditUserMachineComponent;
  let fixture: ComponentFixture<EditUserMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserMachineComponent]
    });
    fixture = TestBed.createComponent(EditUserMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
