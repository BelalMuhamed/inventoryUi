import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Group } from 'src/app/Model/Groups/group';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { GroupNamesService } from 'src/app/Services/GroupNames/group-names.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-names',
  templateUrl: './group-names.component.html',
  styleUrls: ['./group-names.component.css']
})
export class GroupNamesComponent implements OnInit{
  constructor(private fb:FormBuilder,private branchService:BranchService,private groupNamesService:GroupNamesService,private authService:AuthService){}
  groupNameForm!:FormGroup;
  branches:BranchVm[] =[]; 
  groupTypes:string[] = ['Card Center Admin',"Report Viewer",'IT Admin','Branch Admin','User'];
  groupNames:string[] = [];
  groups:Group[] = [];
  ngOnInit(): void {
    this.getAllBranches();
    this.initFormGroupName();
    this.getAllGroupNames();
  }
  initFormGroupName(){
    this.groupNameForm = this.fb.group({
      branchName:['',Validators.required],
      groupType:['',Validators.required],
      groupName:['',Validators.required],
    })
  }
  getAllBranches(){
    this.branchService.getAllBranches().subscribe({
      next:(data:any)=>{this.branches = data},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Get Branches Done")}
    })
  }
  addGroupName(){

    let groupName:string = "AUB.EGYPT."+this.groupNameForm.get("branchName")?.value+"."+this.groupNameForm.get("groupType")?.value;
    this.groupNameForm.addControl('groupName',new FormControl(groupName));
    console.log(this.groupNameForm.value);
    this.groupNamesService.addGroupName(this.groupNameForm.value).subscribe({
      next:(data:any)=>{
        Swal.fire({
          title:"Success",
          icon:"success",
          text:data.groupName + " has been added for " + data.branchName
        })
        console.log(data)
      },
      error:(err)=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })

      },
      complete:()=>{

      }
    })
  }


  getAllGroupNames() {
    this.authService.getAllGroups().subscribe({
      next:(data) => {
        this.groupNames = data;
      },
      error:(error) => {
        console.log(error);
      }
    })
  }

  getAllGroupFromDB() {
    this.groupNamesService.getGroups().subscribe({
      next:(data) => {
        console.log(data);
      },
      error:(error) => {
        console.log(error);
      }, 
      complete:() => {
        
      },
    })
  }

  getBranchGroups(branchName:string) {
    this.groupNamesService.getBranchGroups(branchName).subscribe({
      next:(data) => {
        this.groups = data;
        console.log(this.groups);
      },
      error:(error) => {
        console.log(error);
      }, 
      complete:() => {
        
      },
    })
  }

  deleteGroup(groupId:number) {
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
        this.groupNamesService.deleteGroup(groupId).subscribe({
          next:(data) => {
          },
          error:(error) => {
    
          },
          complete:() => {
           this.groups = this.groups.filter(g => g.id != groupId);
            Swal.fire({
              title: "Deleted!",
              text: "Group has been deleted.",
              icon: "success"
            });
          }
        })
      }
    });

  }

  onBranchNameChange(event:any){
    const branchName = event.target.value;
    this.getBranchGroups(branchName);
  }


  get branchName(){return this.groupNameForm.get("branchName")};
  get groupType(){return this.groupNameForm.get("groupType")};
  get groupName(){return this.groupNameForm.get("groupName")};

}
