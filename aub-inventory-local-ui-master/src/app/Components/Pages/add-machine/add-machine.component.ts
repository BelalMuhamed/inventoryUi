import { Group } from 'src/app/Model/Groups/group';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { IAddedMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-machine',
  templateUrl:'./add-machine.component.html',
  styleUrls: ['./add-machine.component.css']
})
export class AddMachineComponent {
  //#region Services
     private _branchService =inject(BranchService);
     private _machineService =inject(MachinesConfigsService);
     private router =inject(Router)

  //#endregion


   //#region  unsubscribe
      private _UnSubscribebranchService !: Subscription;
     private _UnSubscribemachineService !: Subscription;
     private _unsubscribeRouter !: Subscription;

      //#endregion

  //#region variables
        addMachine !:FormGroup;
        branches!:BranchVm[];
        apiError:string="";
        //#endregion
  //#region  oninit
      ngOnInit():void
      {
        //#region get Branches
        this._UnSubscribebranchService= this._branchService.getAllBranches().subscribe({
          next:(res)=>{
              this.branches=res;


          },
          error:(err)=>
          {
            Swal.fire({
                      title:"Error",
                      icon:"error",
                      text:err.error.message
                    });

          }
        })
        //#endregion
        this. addMachine = new FormGroup({
    ip:new FormControl<string>('',{validators:[Validators.required, Validators.pattern(/^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/)]}),
    feederId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    hooperId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    rejectedId: new FormControl<number|null>(null,{validators:[Validators.required,Validators.pattern('^[01]$')]}),
    port: new FormControl<string>('',{validators:[Validators.required]}),
    
    model: new FormControl<string>('',{validators:[Validators.required]}) ,
    name: new FormControl<string>('',{validators:[Validators.required]}) ,
    sn: new FormControl<string>('',{validators:[Validators.required]}) ,
    branchId: new FormControl<number>(0,{validators:[Validators.required]})

  })
      }


  //#endregion

    //#region unsubscription
      ngOnDestroy():void
      {
        this._UnSubscribebranchService?.unsubscribe();
        this._UnSubscribemachineService?.unsubscribe();
        this._unsubscribeRouter?.unsubscribe();
      }
    //#endregion

    //#region Methods
    AddMachine()
    {


      this._UnSubscribemachineService=this._machineService.AddMachine(this.addMachine.value).subscribe(
        {

          next:(res)=>{
             Swal.fire({
  title: "Machine Added!",
  icon: "info",
  timer: 1000,
  showConfirmButton: false
});

setTimeout(() => {
  this.router.navigate(['/machines']);
}, 1000);

          },error:(err)=>{
            console.log(err)
                Swal.fire({
            title: "Something Went Wrong",
            icon:"error",
            text:err.error || err.errors || err.error.errorMessage
          })
          }
        }
      )
    }
    //#endregion
  get branchId() {return this.addMachine.get("branchId");}

  }
