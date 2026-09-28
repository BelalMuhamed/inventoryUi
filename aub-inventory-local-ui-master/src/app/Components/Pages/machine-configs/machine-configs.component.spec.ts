import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineConfigsComponent } from './machine-configs.component';

describe('MachineConfigsComponent', () => {
  let component: MachineConfigsComponent;
  let fixture: ComponentFixture<MachineConfigsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineConfigsComponent]
    });
    fixture = TestBed.createComponent(MachineConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
