import { LoginServiceService } from './../../../Services/login-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AssignMachineToUserService } from './../../../Services/assignmachinetouser/assign-machine-to-user.service';
import { Component, inject, ViewChild } from '@angular/core';
import { IassignMachineToUser, IassignMachineToUserRequest } from 'src/app/ViewModels/iassign-machine-to-user';
import Swal from 'sweetalert2';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import { EditUserMachineComponent } from '../edit-user-machine/edit-user-machine.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-assign-machine-to-user',
  templateUrl: './assign-machine-to-user.component.html',
  styleUrls: ['./assign-machine-to-user.component.css']
})
export class AssignMachineToUserComponent {
  constructor(private dialog: MatDialog,private _GetIp:LoginServiceService) {}
  //#region Services
      private _assignMachineService=inject(AssignMachineToUserService);
    private _assignMachineService02=inject(AssignMachineToUserService);


  //#endregion
  //#region  UnSubscribers
  _unSubScripe_assignMachineService !: Subscription;
  _unSubScripe_assignMachineService02 !: Subscription;
  _UnSubscribe_assignMachineService01 !:Subscription;


  //#endregion
  //#region variables
  MachinesWithUsers !:IassignMachineToUser[]
  branchName:string|null=null;
  isloading :boolean=false;
  searchText = '';
  paginatorReady = false;
  displayedColumns: string[] = ['userName', 'machineIp','machineName','BranchName','actions'];
  dataSource = new MatTableDataSource<IassignMachineToUser>([]);

  searchQuery:string = '';
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!:MatSort;
 isAppeared:boolean = true;

  //#endregion
  //#region Hooks

  //#region OnInit
ngOnInit():void
{
  //#region get All users with machines
    this.loadMachines()
  //#endregion





}
  //#endregion
 ngAfterViewInit(): void {
    // Paginator and sort become available here
   this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  //#region onDestroy
  ngOnDestroy()
  {
    this._unSubScripe_assignMachineService?.unsubscribe();
    this._unSubScripe_assignMachineService02?.unsubscribe();
    this._UnSubscribe_assignMachineService01?.unsubscribe();
  }
  //#endregion
  //#endregion


  //#region PopUp
  openPopup(branchNAme :string, UserNAme: string) {
  const dataToSend = {  branchName: branchNAme,
    userName:UserNAme };

  const dialogRef = this.dialog.open(EditUserMachineComponent, {
    data: dataToSend
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let paramReq :IassignMachineToUserRequest={
        userName:result.userName,
        machineIp:result.selectedMachine

      }
         this._unSubScripe_assignMachineService02 =this._assignMachineService02.UpdateMachineWithUser(paramReq).subscribe(
          {
            next:(res)=>{
              console.log(res);

                this.loadMachines();
            },
            error:(err)=>{
              Swal.fire({
            title: "Something Went Wrong",
            icon:"error",
            text:err.error || err.errors || err?.error?.errorMessage,

          })

            }
          }
         )
    }
  });
}
  //#endregion


  //#region  methods
   loadMachines() {
    this._unSubScripe_assignMachineService = this._assignMachineService.GetAllUserWithMachines(this.branchName).subscribe({
      next: (res) => {
        this.MachinesWithUsers = res;
        this.dataSource.data = this.MachinesWithUsers;
        console.log(this.MachinesWithUsers);


        this.dataSource.filterPredicate = (data: IassignMachineToUser, filter: string) => {
          const lowercaseFilter = filter.trim().toLowerCase();
          return data.userName.toLowerCase().includes(lowercaseFilter) ||
                 data.machineName.toLowerCase().includes(lowercaseFilter);
        };


        this.paginator.pageSize = 10;
        this.isloading = true;
      },
      error: (err) => {
        Swal.fire({
          title: "Can't get users and machines data !!!",
          icon: "error",
          text: err.error || err.errors || err.error.errorMessage,
          timer: 2000
        });
      }
    });
  }


      Delete(userName :string)
      {
        Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete the machine for this user ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Exit',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {

      this._UnSubscribe_assignMachineService01 = this._assignMachineService.Delete(userName).subscribe({
        next: (res) => {
          // this.MachinesWithUsers = this.MachinesWithUsers.filter(item => item.userName !== userName);
          this.loadMachines();
          Swal.fire('Deleted!', 'Machine for this user has been Deleted.', 'success');
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


      applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
  //#endregion

}
