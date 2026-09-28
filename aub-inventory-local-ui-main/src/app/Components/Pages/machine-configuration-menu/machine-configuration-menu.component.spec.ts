import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineConfigurationMenuComponent } from './machine-configuration-menu.component';

describe('MachineConfigurationMenuComponent', () => {
  let component: MachineConfigurationMenuComponent;
  let fixture: ComponentFixture<MachineConfigurationMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineConfigurationMenuComponent]
    });
    fixture = TestBed.createComponent(MachineConfigurationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
