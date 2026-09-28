import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMachineConfigComponent } from './edit-machine-config.component';

describe('EditMachineConfigComponent', () => {
  let component: EditMachineConfigComponent;
  let fixture: ComponentFixture<EditMachineConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMachineConfigComponent]
    });
    fixture = TestBed.createComponent(EditMachineConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
