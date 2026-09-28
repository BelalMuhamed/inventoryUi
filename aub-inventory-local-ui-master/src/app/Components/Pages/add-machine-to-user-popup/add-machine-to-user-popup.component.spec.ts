import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachineToUserPopupComponent } from './add-machine-to-user-popup.component';

describe('AddMachineToUserPopupComponent', () => {
  let component: AddMachineToUserPopupComponent;
  let fixture: ComponentFixture<AddMachineToUserPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMachineToUserPopupComponent]
    });
    fixture = TestBed.createComponent(AddMachineToUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
