import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AssignMachineToUserService } from 'src/app/Services/assignmachinetouser/assign-machine-to-user.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import Swal from 'sweetalert2';
import { AddMachineToUserPopupComponent } from '../add-machine-to-user-popup/add-machine-to-user-popup.component';

@Component({
  selector: 'app-add-machine-to-user',
  templateUrl: './add-machine-to-user.component.html',
  styleUrls: ['./add-machine-to-user.component.css']
})
export class AddMachineToUserComponent {
constructor(private dialog: MatDialog){}

   dataSource:any;
@ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!:MatSort;
isAppeared:boolean = true;
displayedColumns: string[] = ['username', 'action'];
  //#region Data
  AllBranches !:BranchVm[];
  UsersNames !:string[];
//#endregion
//#region variables
IsBranchSelected : boolean =false;
 searchQuery:string = '';
  selectedBranch:string='';

//#endregion
//#region Services
private readonly _BranchService=inject(BranchService);
private readonly _AssignMachineToUserService=inject(AssignMachineToUserService);
//#endregion

//#region UnSupScriper
private _UnSubscripe_BranchService !: Subscription;
private _UnSubscripeAssignMachineToUserService !: Subscription;
private _UnSubscripe_BranchService02 !: Subscription;


//#endregion
//#region methods

openPopup(UserNAme :string) {
  const dataToSend = {userName:UserNAme,branchname:this.selectedBranch}

  const dialogRef = this.dialog.open(AddMachineToUserPopupComponent, {


    data: dataToSend
  });

  dialogRef.afterClosed().subscribe((res)=>{
 this._UnSubscripe_BranchService02= this._AssignMachineToUserService.GetUserWithOutMachine(this.selectedBranch).subscribe({
      next: (data) => {
        this.IsBranchSelected=true;
        this.UsersNames=data;


        this.dataSource = new MatTableDataSource<string>(this.UsersNames);
        this.dataSource.filterPredicate = (data: string, filter: string) => {
        const lowercaseFilter = filter.trim().toLowerCase();
        return data.toLowerCase().includes(lowercaseFilter);

      };
             setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

      },
      error: (err) => {
        this.IsBranchSelected=false;
        Swal.fire({
        title:'Error connecting Server !',
        text:`cann't load Data for this branch  !`,
         icon:"error",
         timer:2000

      })
      }
    });
  });
}
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
onBranchSelect(event: Event): void {
     this.selectedBranch = (event.target as HTMLSelectElement).value;
    this._AssignMachineToUserService.GetUserWithOutMachine(this.selectedBranch).subscribe({
      next: (data) => {
        this.IsBranchSelected=true;
        this.UsersNames=data;


        this.dataSource = new MatTableDataSource<string>(this.UsersNames);
        this.dataSource.filterPredicate = (data: string, filter: string) => {
        const lowercaseFilter = filter.trim().toLowerCase();
        return data.toLowerCase().includes(lowercaseFilter);

      };
             setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

      },
      error: (err) => {
        this.IsBranchSelected=false;
        Swal.fire({
        title:'Error connecting Server !',
        text:`cann't load Data for this branch  !`,
         icon:"error",
         timer:2000

      })
      }
    });
  }
//#endregion
//#region Hooks
//#region oninit
 ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
ngOnInit():void
{
this._UnSubscripe_BranchService=this._BranchService.getAllBranches().subscribe({
  next:(res)=>{
    this.AllBranches=res;
    console.log(res);


  },error:(err)=>{
      Swal.fire({
        title:'Error connecting Server !',
        text:`cann't load branches !`,
         icon:"error",
         timer:2000

      })
  }
})
}

//#endregion
//#region ondestroy
  ngOnDestroy(): void {
    this._UnSubscripe_BranchService?.unsubscribe();
    this._UnSubscripeAssignMachineToUserService?.unsubscribe();
    this._UnSubscripe_BranchService02?.unsubscribe();
  }
//#endregion
//#endregion
}
