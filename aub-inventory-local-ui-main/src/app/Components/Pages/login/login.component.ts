import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserModel } from 'src/app/Model/Users/iuser-model';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  ngOnInit(): void {

    this.initLoginForm();
    this.getAllBranches();
  }
  constructor(private fb: FormBuilder,private branchService:BranchService,private authService:AuthService,private router:Router) { }
  branches:BranchVm[] = [];



  initLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      branchName: ['',Validators.required]
    })
  }
  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }
  get username() {return this.loginForm.get("username");}
  get password() {return this.loginForm.get("password");}
  get branchName() {return this.loginForm.get("branchName");}
  login() {
    let user:IUserModel = this.loginForm.value;
    this.authService.getToken(user).subscribe(
      {
        next:(data) => {
          console.log(data);

        },
        error:(error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.message,
          })
        },
        complete:() => {
          const role = localStorage.getItem('roles');
          if(role?.includes("Card Center Admin")){
            this.router.navigate(['/DashBoard']);
          }
          else if(role?.includes("Branch Admin")){
            this.router.navigate(['/request']);
          }
          else if(role?.includes("IT Admin")){
            this.router.navigate(['/configration']);
          }
          else if(role?.includes("Report Viewer")){
            this.router.navigate(['/report']);
          }
          else if(role?.includes("User")){
           this.router.navigate(['/User-Menu']);
          }
        }
      }
    )
  }
}
