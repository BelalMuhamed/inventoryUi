import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isBranchAdmin:boolean = false;
    isCCAdmin:boolean = false;
    isITAdmin:boolean = false;
    isReportViewer:boolean = false;
    username:string = "";
    isUser:boolean=false;
    roles:string = "";
    isUserLogged:boolean = false;
    userRole:string = "";
    constructor(private authService:AuthService,private router:Router) {
      this.checkUserRoles();
    }
  ngOnInit(): void {
    this.getUsername();
    this.getUserRole();

    this.authService.loggedStatus.subscribe({
      next:(status) => {
        this.isUserLogged = status;
      }
    })  }

    checkUserRoles()
    {
        const roles = (localStorage.getItem('roles'));
        if(roles?.includes("Card Center Admin")){
          this.isCCAdmin = true;
        }
        if(roles?.includes("IT Admin")){
          this.isITAdmin = true;
        }
        if(roles?.includes("Branch Admin")){
          this.isBranchAdmin = true;
        }
        if(roles?.includes("Report Viewer")){
          this.isReportViewer = true;
        }
        if(roles?.includes("User")){
          this.isUser=true;
        }
    }

      //Log Out
  logOut() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logOut();
        this.router.navigate(['/login'])
      }
    })
  }


  getUsername() {
    this.username = JSON.stringify(localStorage.getItem('name')).replaceAll('"','');
  }



  getUserRole() {
    this.userRole = JSON.stringify(localStorage.getItem("roles")).replaceAll('"',' ');
  }
}
