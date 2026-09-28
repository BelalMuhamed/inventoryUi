import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { IMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-machine',
  templateUrl: './edit-user-machine.component.html',
  styleUrls: ['./edit-user-machine.component.css'],

})
export class EditUserMachineComponent {

//#region  Constructor

  constructor(private dialogRef: MatDialogRef<EditUserMachineComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {}

//#endregion

//#region services
private _MachineConfigService=inject(MachinesConfigsService);
//#endregion

//#region  unsubScriber
 private _UnSubscribe_MachineConfigService !: Subscription;
//#endregion

//#region  variables
selectedMachine: string | null = null;
machinesInBranch !:IMachineConfigs[];


//#endregion

//#region Methods
submit() {
  this.dialogRef.close({
    selectedMachine: this.selectedMachine,
    userName: this.data.userName
  });
}
  //#endregion

//#region Hooks
  ngOnInit()
  {



   this._UnSubscribe_MachineConfigService= this._MachineConfigService.GetByBranchName(this.data.branchName).subscribe({
      next:(res)=>{

        this.machinesInBranch=res;
      },error:(err)=>
      {
       Swal.fire({
      title: "Something Went Wrong",
      icon:"error",
      text:err.error || err.errors || err.error.errorMessage,
      timer:1000
    })
     setTimeout(() => {
       this.dialogRef.close();
      }, 1000);

      }
    })
  }
  ngOnDestroy()
  {
    this._UnSubscribe_MachineConfigService?.unsubscribe();

  }
//#endregion
}
