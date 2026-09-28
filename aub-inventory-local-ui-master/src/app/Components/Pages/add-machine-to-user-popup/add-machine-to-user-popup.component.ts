import { IassignMachineToUserRequest } from 'src/app/ViewModels/iassign-machine-to-user';
import { AssignMachineToUserService } from 'src/app/Services/assignmachinetouser/assign-machine-to-user.service';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { IMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-machine-to-user-popup',
  templateUrl: './add-machine-to-user-popup.component.html',
  styleUrls: ['./add-machine-to-user-popup.component.css']
})
export class AddMachineToUserPopupComponent {
   constructor(private dialogRef: MatDialogRef<AddMachineToUserPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {}

MachinesPerBranch!:IMachineConfigs[]
IsMAchineSelected:boolean=false;
selectedMachine:string=''

private _machinesService=inject(MachinesConfigsService);
private __AssignMachineToUserService=inject(AssignMachineToUserService);
  _unSubScripe_machinesService !: Subscription;
  _unSubScripe__AssignMachineToUserService !: Subscription;

ngOnInit():void{
  this._unSubScripe_machinesService=this._machinesService.GetByBranchName(this.data.branchname).subscribe({
    next:(res)=>{
this.MachinesPerBranch=res;

    },error:(err)=>{
       Swal.fire({
              title:'Error connecting Server !',
              text:`cann't load Data for this branch  !`,
               icon:"error",
               timer:2000

            })

    }


  })

}
ngOnDestroy(): void {
  this._unSubScripe_machinesService?.unsubscribe();
  this._unSubScripe__AssignMachineToUserService?.unsubscribe();
}
onMachineSelect(event: Event): void {
     this.selectedMachine = (event.target as HTMLSelectElement).value;
     this.IsMAchineSelected=true;

  }
  submit() {
    const requestParam: IassignMachineToUserRequest = {
  machineIp: this.selectedMachine,
  userName:this.data.userName
};
    this._unSubScripe__AssignMachineToUserService=this.__AssignMachineToUserService.Add(requestParam).subscribe({
      next: (data) => {
           Swal.fire({
        title:'Machine added !',
         icon:"info",
         timer:1000

      })
       this.dialogRef.close({
        success: true,
        data: requestParam
      });

      },
      error: (err) => {

        Swal.fire({
        title:'Error  Server !',
        text:`cann't add machine to user  !`,
         icon:"error",
         timer:2000

      })
      }
    });

}
}


//#region wait


//#endregion
