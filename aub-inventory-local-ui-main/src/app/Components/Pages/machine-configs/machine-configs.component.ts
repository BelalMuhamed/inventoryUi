import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MachinesConfigsService } from 'src/app/Services/MachinesConfigs/machines-configs.service';
import { IMachineConfigs } from 'src/app/ViewModels/imachine-configs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-machine-configs',
  templateUrl: './machine-configs.component.html',
  styleUrls: ['./machine-configs.component.css']
})
export class MachineConfigsComponent {

//#region Mat Table for Paginator
dataSource:any;
 @ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
isAppeared:boolean = true;
displayedColumns: string[] = ['ip','name','model','port','feederId','branchName','Actions'];
//#endregion

  //#region Services
    private _machineService =inject(MachinesConfigsService);
    //#endregion

  //#region  unsubscribe
     private _UnSubscribemachineService !: Subscription;
      private _UnSubscribemachineService01 !: Subscription;
     //#endregion



    //#region  variables
    Machines! : IMachineConfigs[];
    searchText = '';
    //#endregion

    //#region Methods
    Delete(ip :string)
    {
      Swal.fire({
  title: 'Are you sure?',
  text: 'Do you want to delete the machine configuration?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Delete',
  cancelButtonText: 'Exit',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {

    this._UnSubscribemachineService01 = this._machineService.Delete(ip).subscribe({
      next: (res) => {
    this.getMachines();
        Swal.fire('Deleted!', 'Machine configuration has been Deleted.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Something went wrong: ' + (err.error || err.message), 'error');
      }
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire('Cancelled', 'No changes were made.', 'info');
  }
});

    }
    //#endregion
    ngOnInit():void
    {
//       this._UnSubscribemachineService = this._machineService.GetAllMachines().subscribe({
//         next:(res)=>{
// console.log(res);

//           this.Machines=res;
//            this.dataSource = new MatTableDataSource<IMachineConfigs>(this.Machines);
//                 this.dataSource.filterPredicate = (data: IMachineConfigs, filter: string) => {
//         const lowercaseFilter = filter.trim().toLowerCase();
//         return data.name.toLowerCase().includes(lowercaseFilter) ||
//               data.branchName.toLowerCase().includes(lowercaseFilter);
//       };

//                 this.paginator.pageSize = 10;
//                 this.dataSource.paginator = this.paginator;
//                 this.dataSource.sort = this.sort;

//         },
//         error:(err)=>{
//           Swal.fire({
//            title:"Error",
//            icon:"error",
//            text:err.error.message
//            });
//         }

//       })


this.getMachines();
    }

    getMachines()
    {
       this._UnSubscribemachineService = this._machineService.GetAllMachines().subscribe({
        next:(res)=>{
console.log(res);

          this.Machines=res;
           this.dataSource = new MatTableDataSource<IMachineConfigs>(this.Machines);
                this.dataSource.filterPredicate = (data: IMachineConfigs, filter: string) => {
        const lowercaseFilter = filter.trim().toLowerCase();
        return data.name.toLowerCase().includes(lowercaseFilter) ||
              data.branchName.toLowerCase().includes(lowercaseFilter);
      };

                this.paginator.pageSize = 10;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

        },
        error:(err)=>{
          Swal.fire({
           title:"Error",
           icon:"error",
           text:err.error.message
           });
        }

      })
    }
    applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

    ngOnDestroy():void
    {
      this._UnSubscribemachineService?.unsubscribe();
      this._UnSubscribemachineService01?.unsubscribe();
    }

}
