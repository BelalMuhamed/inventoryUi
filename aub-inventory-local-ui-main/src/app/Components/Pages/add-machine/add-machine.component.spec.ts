import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachineComponent } from './add-machine.component';

describe('AddMachineComponent', () => {
  let component: AddMachineComponent;
  let fixture: ComponentFixture<AddMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMachineComponent]
    });
    fixture = TestBed.createComponent(AddMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
