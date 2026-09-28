import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { user } from './Model/user';
import { UserService } from 'src/app/Services/User/user.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { IAUBUsersParams } from 'src/app/Model/Users/iuser-model';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  userList:user[] = [];
  UsersCount !: number;
   defaultParams: IAUBUsersParams = {
  pageNumber: 1,
  pageSize: 10,
  search:null
};
  dataSource:any;
  searchTerm: string = '';

  searchQuery:string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  usernames:string[] = [];
  isAppeared:boolean = true;
  constructor(private userService:UserService,private authService:AuthService,public dialog: MatDialog){

  }

  ngOnInit(): void {
    this.getusernames();
    this.getUsers();
  }
  getUsers(): void {
  this.userService.getUsers(this.defaultParams).subscribe({
    next: (res) => {
      this.userList = res.users;
      

      this.UsersCount = res.count;


    },
    error: (err) => console.error(err)
  });
}

onPageChange(event: PageEvent): void {
  this.defaultParams.pageNumber = event.pageIndex + 1;
  this.defaultParams.pageSize = event.pageSize;
  this.getUsers();
}

  displayedColumns: string[] = ['username', 'role','action'];

  search(): void {
  this.defaultParams.search = this.searchTerm;
  this.defaultParams.pageNumber = 1;
  this.getUsers();
}


  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {users:this.usernames,isAppeared:this.isAppeared},
    });


    dialogRef.afterClosed().subscribe(result => {
    this.getUsers()
    });
  }


  openEditDialog(username:string,role:string): void {
    const dialogRef = this.dialog.open(EditUserComponent, {

      data: {username: username, role: role},
    });

    dialogRef.afterClosed().subscribe(result => {
    this.getUsers();
    });
  }

  deleteUser(username:string){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(username).subscribe({
          next:(data) => {

          },
          complete:() => {
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success"
            });

           this.getUsers();
          },
          error:(err) => {

          }
        });
      }
    });

  }

  getusernames(){
    this.authService.getADUsers().subscribe({
      next:(data) => {
        this.usernames = data;
        this.isAppeared = false;
      }
    })
  }

}
