import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { BranchVm } from 'src/app/ViewModels/branch-vm';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  addBranchForm!: FormGroup;
  updateBranchForm!: FormGroup;
  branches: BranchVm[] = [];
  selectedBranch: any;
  constructor(private branchService: BranchService, private fb: FormBuilder,) { }
  ngOnInit(): void {
    this.initAddBranchForm();
    this.initUpdateBranchForm();
    this.getAllBranches();
  }
  initAddBranchForm() {
    this.addBranchForm = this.fb.group({
      branchName: ['', Validators.required],
      // lowCardAmount: [, Validators.required],
      // mediumCardAmount: [, Validators.required],
    })
  }
  initUpdateBranchForm() {
    this.updateBranchForm = this.fb.group({
      branchNameSelect: ['', Validators.required],
       branchNameText: ['', Validators.required],
      // lowCardAmount: [, Validators.required],
      //mediumCardAmount: [, Validators.required],
    })
  }
  addBranch() {
    this.branchService.addBranch(this.addBranchForm.value).subscribe({
      next: (data: any) => {
         console.log(data),
          this.getAllBranches()
          this.initAddBranchForm()
         },
      error:(err)=>{
        console.log(err);
        Swal.fire({
          title:"Error",
          icon:"error",
          text:err.error.message
        })
      },
      complete:()=>{
        Swal.fire({
          title:"Success",
          icon:"success",
          text:"Branch Added Successfully",
          showConfirmButton:false,
          timer:2000,
        })
      }
    })
  }
  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: any) => { this.branches = data },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Get Branches Done") }
    })
  }
  updateBranch() {
    // branch.branchName = this.updateBranchForm.value.branchNameText;
    // branch.lowCardAmount = this.updateBranchForm.value.lowCardAmount;
    // branch.mediumCardAmount = this.updateBranchForm.value.mediumCardAmount;
    const oldBranchName = this.branchNameSelectupdateForm?.value;
    const newBranchName = this.branchNameTextupdateForm?.value;
    this.branchService.updateBranch(oldBranchName, newBranchName).subscribe({
      next: (data: any) => { console.log(data) },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon:"error",
          title:"Something went wrong",
          text:err.error || err.error.errorMessage||err,
        })
      },
      complete: () => {
        this.getAllBranches();
        Swal.fire({
          title:"Success",
          icon:"success",
          text:"Branch Updated Successfully",
          showConfirmButton:false,
          timer:2000,
        })
      }
    });
  }
  selectBranch(event: any) {
    this.selectedBranch = event.target.value;
    this.branchNameTextupdateForm?.setValue(this.selectedBranch);
  }

  get branchNameAddForm(){return this.addBranchForm.get("branchName")}
  get lowCardAmountAddForm(){return this.addBranchForm.get("lowCardAmount")}
  get mediumCardAmountForm(){return this.addBranchForm.get("mediumCardAmount")}

  get branchNameSelectupdateForm(){return this.updateBranchForm.get("branchNameSelect")}
  get branchNameTextupdateForm(){return this.updateBranchForm.get("branchNameText")}
  get lowCardAmountupdateForm(){return this.updateBranchForm.get("lowCardAmount")}
  get mediumCardAmounttupdateForm(){return this.updateBranchForm.get("mediumCardAmount")}

}
