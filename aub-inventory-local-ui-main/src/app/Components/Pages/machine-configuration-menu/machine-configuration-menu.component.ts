import { Component } from '@angular/core';
import { LoaderService } from 'src/app/Services/loader/loader.service';

@Component({
  selector: 'app-machine-configuration-menu',
  templateUrl: './machine-configuration-menu.component.html',
  styleUrls: ['./machine-configuration-menu.component.css']
})
export class MachineConfigurationMenuComponent {
constructor(public loaderService:LoaderService)
{

}
}
