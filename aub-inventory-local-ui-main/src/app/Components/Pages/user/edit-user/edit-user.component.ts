import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { user } from '../Model/user';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/Services/User/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  // branchNames: string[] = [];
  roleNames:string[] = ['IT Admin','Card Center Admin','Branch Admin','Report Viewer','User'];
  // oldBranch:string = '';
  oldRole:string = '';
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: user,
    // private branchService:BranchService,
    private userService:UserService,
  ) {
    // this.oldBranch = data.branchName;
    this.oldRole = data.role;
  }

  ngOnInit(): void {
    // this.getBranches();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  // getBranches() {
  //   this.branchService.getAllBranches().subscribe({
  //     next:(branches)=>{
  //       this.branchNames = branches.map(s => s.branchName);
  //     }
  //   })
  // }

  editUser(){
    let user = {} as user;
    user.username = this.data.username;
    // user.branchName = this.data.branchName;
    user.role = this.data.role;

    // if(this.data.branchName == this.oldBranch && this.data.role == this.oldRole)
      if( this.data.role == this.oldRole)
    {
      Swal.fire('No Changes');
      return;
    }
    
    this.userService.update(user).subscribe({
      next:(data) => {

      },
      error:(err) => {

      },
      complete:() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "user has been updated",
          showConfirmButton: false,
          timer: 1500
        });
      this.dialogRef.close('updated');
      }
    });
  }
}
