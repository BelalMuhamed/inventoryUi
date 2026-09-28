import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { UserService } from 'src/app/Services/User/user.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { user } from '../Model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{


  roleNames:string[] = ['IT Admin','Card Center Admin','Branch Admin','Report Viewer','User'];
  // usernames:string[] = [];
  // branches:BranchReadVM[] = [];
  // isAppeared:boolean = true;
  addUserForm!:FormGroup;
  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {users: string[]},
              private fb:FormBuilder,
              private authService:AuthService,
              private userService:UserService) 
  {
    console.log('dataaaa',data);
    this.addForm() 
  }

  ngOnInit(): void {
    // this.getUsernames();
    // this.getBranchNames();
  }
  
  addForm() : void {
    this.addUserForm = this.fb.group({
      username:['',Validators.required],
      role:['',Validators.required],
      // branch:['',Validators.required]
    })
  }
  
  addUser(){
    let user = {} as user;
    if(this.addUserForm.invalid){
      return;
    }
    user.username = this.addUserForm.get('username')?.value;
    user.role = this.addUserForm.get('role')?.value;
    // user.branchName = this.addUserForm.get('branch')?.value;
    this.userService.add(user).subscribe({
      next:(data) => {
        Swal.fire({
          position: "center-end",
          icon: "success",
          title: data.username + "has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this.dialogRef.close();
      },
      error:(err)=>{
        Swal.fire({
          icon:"error",
          title:"Something Went Wrong",
          text:err.error.message || err.error || err
        })
      },
      complete:()=>{console.log("User Added Successfully");}
    })

  }

  // getUsernames(): void {
  //   this.authService.getADUsers().subscribe({
  //     next:(data) => {
  //       this.usernames = data;
  //       this.isAppeared = false;
  //     }
  //   })
  // }

  // getBranchNames(): void {
  //   this.branchService.getAllBranches().subscribe({
  //     next:(data) => {
  //       this.branches = data;
  //     }
  //   })
  // }

  onNoClick(): void {
    this.dialogRef.close();
  };

  get username() {
    return this.addUserForm.get('username');
  }

  get role(){
    return this.addUserForm.get('role');
  }

  // get branch() {
  //   return this.addUserForm.get('branch');
  // }
}
