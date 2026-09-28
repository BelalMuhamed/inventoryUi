import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ExportEventFileService } from 'src/app/Services/Export/export-file.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-export-event-file',
  templateUrl: './export-event-file.component.html',
  styleUrls: ['./export-event-file.component.css']
})
export class ExportImportComponent implements OnInit {
  branches: BranchReadVM[] = [];
  stock: any;
  selectedBranch:string = ''; // Use appropriate types
  selectedUsername:string = '';
  selectedPassword:string = '';
  form: FormGroup;
  isAppeared:boolean = true;
  usernames:string[] = [];
  constructor(
    private branchService: BranchService, 
    private stockService: StockService,
    private exportEventService:ExportEventFileService,
    private authService:AuthService,
    private fb:FormBuilder) {
     this.selectedBranch = localStorage.getItem('branchName')!;
    this.form = this.fb.group({
      branchName:[''],
      branchId:[''],
      username:[''],
      password:[''],
      products: this.fb.array([])
    });
  }
  ngOnInit(): void {
    this.getUsernames();
    this.getBranches();
    this.getStock();
  }

  getBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (data: BranchReadVM[]) => {
        this.branches = data;
      }
    })
  }

  getStock() {
    this.stock = [];
    const productsArray = this.form.get('products') as FormArray; 
    productsArray.clear(); // Clear existing products

    if (this.selectedBranch != '') {
      this.stockService.GetBranchStock(this.selectedBranch).subscribe({
        next: (data) => {
          this.stock = data;
          this.populateProducts();
        }
      })
    }
  }


  populateProducts() {
    const productsArray = this.form.get('products') as FormArray;
    this.stock.productsWithAmount.forEach((product:any) => {
      productsArray.push(this.fb.group({
        productId: [product.productId],
        productName: [product.productName],
        cardAmount: [],
        maxAmount : [product.cardAmount]
      }));
    });
  }

  

  export(){
    let isEmpty = this.validateEmptyFields();
    if(!isEmpty) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "username and password are required!",
      });
      return;
    }

    let isValid = this.validateMaxAmount();
    if(!isValid) {
      
      return;
    }

    this.removeZeroAmounts();
    if(this.products.length == 0){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't export empty file..",
      });
      this.getStock();
      return;
    }


    this.form.get('username')?.setValue(this.selectedUsername);
    this.form.get('password')?.setValue(this.selectedPassword);
    this.form.get('branchName')?.setValue(this.selectedBranch);
    let branchId = this.branches.find(b => b.branchName == this.selectedBranch)?.id;
    this.form.get('branchId')?.setValue(branchId);
    this.exportEventService.exportEventFile(this.form.value).subscribe({
      next:(response:any) => {
          const fileName = response.headers.get('fileName');

          let blob = response.body;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          var timeNow = new Date();
          a.download = fileName;//timeNow.toDateString() + '.kat'; // Set a default file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up URL
      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong!,${error.message}`,
        });
      },
      complete:() => {
        Swal.fire({
          title: "File Exported!",
          text: "File Exported Successfully!",
          icon: "success"
        });
      this.getStock();
      }
    });
  }
  validateEmptyFields() : boolean {
    if(this.selectedUsername == '' || this.selectedUsername == null ||
      this.selectedPassword == '' || this.selectedPassword == null || 
      this.selectedBranch == '' || this.selectedBranch == null){
      return false;
    }
    return true;
  }

  removeZeroAmounts() {
    this.products.controls = this.products.controls.filter(p => p.value.cardAmount !== '0' && p.value.cardAmount != null && p.value.cardAmount != '');

    this.products.updateValueAndValidity();
  }

  validateMaxAmount(): boolean {
    const allProducts = this.products.value;
    for (const p of allProducts) {
      if (p.cardAmount > p.maxAmount) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Insufficient amount, please enter valid amount!",
        });
        return false;
      }
      if(p.cardAmount < 0){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Negative numbers? you can't export negative amount.",
        });
        return false;
      }
    }
    return true; // Return true if all products are valid
  }


  getUsernames(): void {
    this.authService.getADUsers().subscribe({
      next:(data) => {
        this.usernames = data;
        this.isAppeared = false;
      }
    })
  }

  get products(){
    return this.form.get('products') as FormArray;
  }


}



