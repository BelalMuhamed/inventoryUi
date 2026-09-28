import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { concatWith, forkJoin, Subscription } from 'rxjs';
import { CheckIpServiceService } from 'src/app/Services/CheckIpService/check-ip-service.service';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { UsermachineService } from 'src/app/Services/UserMachine/usermachine.service';
import { IMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  private _IpServices =inject(CheckIpServiceService);
 private _UserMachineService=inject(UsermachineService);
 private _router = inject(Router);

  UserName !:string|null ;
  UserIp !:string;
  MIp !:string;

  ngOnInit():void
    {
        this.UserName=localStorage.getItem('username');

    }

CheckIfUserInTheSameBranchOfMachine()
{

        forkJoin({
           UIp: this._IpServices.GetUserIP(),
           Mip: this._UserMachineService.GetMachineByuserName(this.UserName!)
         }).subscribe(
          {
            next:({UIp,Mip})=>{
              this.UserIp=UIp.ip;
             this.MIp=Mip.ip;
            const IsIpsEqual= this.compareFirstThreeOctets(this.UserIp,this.MIp);
            // this._router.navigate(['print-card-holder-name-sigma']);
            this._router.navigate(['/print-card-holder-name', this.UserName]);
            // if(IsIpsEqual)
            // {
            //       this._router.navigate(['/print-card-holder-name', this.UserName]);

            // }
            // else
            // {
            //   Swal.fire(
            //     {
            //       title:"Access Denied !",
            //       text:"you don't have access to print in this branch ",
            //       icon:"error",
            //       timer:2000
            //     }
            //   )
            // }



            },
            error:(err)=>{
                  this._router.navigate(['/print-card-holder-name', this.UserName]);
              //     Swal.fire(
              //   {
              //     title:"Access Denied !",
              //     text:"Cann't detect User Or Machine Ip  !",
              //     icon:"error",
              //     timer:2000
              //   }
              // )
            }
          }
         )

}

 compareFirstThreeOctets(ip1: string, ip2: string): boolean {
  const parts1 = ip1.split('.');
  const parts2 = ip2.split('.');

  if (parts1.length < 3 || parts2.length < 3) {
return false;
  }

  const firstThree1 = parts1.slice(0, 3).join('.');
  const firstThree2 = parts2.slice(0, 3).join('.');

  return firstThree1 === firstThree2;
}


}
