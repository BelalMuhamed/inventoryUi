import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { IUpdatedMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-machine-config',
  templateUrl: './edit-machine-config.component.html',
  styleUrls: ['./edit-machine-config.component.css']
})
export class EditMachineConfigComponent {
//#region Services

     private _machineService =inject(MachinesConfigsService);
     private router =inject(Router)
      _activeRoute = inject(ActivatedRoute);
      MachineDetails !: IUpdatedMachineConfigs;

  //#endregion


   //#region  unsubscribe
     private _UnSubscribemachineService !: Subscription;
     private _unsubscripeActiveRouter !: Subscription;
     private _UnSubscribemachineService01 !: Subscription;


      //#endregion
   //#region Form
     editMachine = new FormGroup({
    ip:new FormControl<string>('',{validators:[Validators.required]}),
    feederId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    hooperId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    rejectedId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    port: new FormControl<string>('',{validators:[Validators.required]}),

    model: new FormControl<string>('',{validators:[Validators.required]}) ,
    name: new FormControl<string>('',{validators:[Validators.required]}) ,
    sn: new FormControl<string>('',{validators:[Validators.required]}) ,


  })
    //#endregion
  //#region variables
        ip !: string|null;
        isloading :boolean= false;
        apiError:string="";
 //#endregion
  //#region  oninit
      ngOnInit():void
      {
        this._unsubscripeActiveRouter= this._activeRoute.paramMap.subscribe({
      next:(params)=>{
        let ip = params.get("ip");
        this.ip=ip;
       this._UnSubscribemachineService= this._machineService.GetByIp(ip).subscribe({
          next:(res)=>{
           this.MachineDetails=res;
           this.isloading=true;
           this.editMachine.patchValue({
            ip:this.MachineDetails.ip,
            feederId:this.MachineDetails.feederId,
            hooperId:this.MachineDetails.hooperId,
            rejectedId:this.MachineDetails.rejectedId,
            port:this.MachineDetails.port,

            model:this.MachineDetails.model,
            name:this.MachineDetails.name,
            sn:this.MachineDetails.sn
           })

          },error:(err)=>
          {
            Swal.fire({
                       title: "Something Went Wrong",
                       icon:"error",
                       text:err.error || err.errors || err.error.errorMessage,
                       timer:1000
                     })
                     setTimeout(() => {
  this.router.navigate(['/machines']);
}, 1000);


          }
        })


      },
        error:(err)=>
        {
           Swal.fire({
                      title: "Something Went Wrong",
                      icon:"error",
                      text:err.error || err.errors || err.error.errorMessage,
                      timer:1000
                    })
setTimeout(() => {
  this.router.navigate(['/machines']);
}, 1000);

        }})



      }


  //#endregion

    //#region unsubscription
      ngOnDestroy():void
      {
        this._UnSubscribemachineService?.unsubscribe();
        this._UnSubscribemachineService?.unsubscribe();
        this._unsubscripeActiveRouter?.unsubscribe();
        this._UnSubscribemachineService01?.unsubscribe();
      }
    //#endregion

    //#region Methods
        Update()
        {
            const Payload:IUpdatedMachineConfigs =  {
              ip:this.editMachine.value.ip!,
                feederId:this.editMachine.value.feederId!,
                hooperId:this.editMachine.value.hooperId!,
                rejectedId:this.editMachine.value.rejectedId!,
                port:this.editMachine.value.port!,
               
                model:this.editMachine.value.model!,
                name:this.editMachine.value.name!,
                sn:this.editMachine.value.sn!,
            }
            this._UnSubscribemachineService01= this._machineService.UpdateMachineConfig(Payload,this.ip).subscribe({
              next:(res)=>{
                   Swal.fire({
                  title: "Machine updated!",
                  icon: "info",
                  timer: 1000,
                  showConfirmButton: false
                });

                setTimeout(() => {
                  this.router.navigate(['/machines']);
                }, 1000);
              },error:(err)=>{
  Swal.fire({
            title: "Something Went Wrong",
            icon:"error",
            text:err.error || err.errors || err.error.errorMessage
          })
              }

            })
        }
    //#endregion

}
