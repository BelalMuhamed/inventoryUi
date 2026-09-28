import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/Services/Branch/branch.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { StockService } from 'src/app/Services/Stock/stock.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { BranchReadVM } from 'src/app/ViewModels/branch-read-vm';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import { StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import { TransferPutVM } from 'src/app/ViewModels/transfer-put-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit{
  transfer:TransferPutVM = {} as TransferPutVM;
  branchesStock:StockReadVM[] = [];
  productsVM:ProductVM[] = [];
  branchesVM:BranchReadVM[] = [];
  form!:FormGroup;
  targetBranch:string = ""; 
  sourceBranch:string = ""; 
  constructor(private stockService:StockService,private productService:ProductService,private branchSerive:BranchService, private fb:FormBuilder,public loaderService:LoaderService) {
    this.initForm();
  }
  ngOnInit(): void {
    this.getBranchesStock();
    this.getBranches();
    this.getProducts();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      productId:['',Validators.required],
      sourceStock:['',Validators.required],
      targetStock:['',Validators.required],
      cardAmount:['',Validators.required]
    })
  }

  getProducts() {
    this.productService.Get().subscribe({
      next:(data) => {
        this.productsVM = data;
      },
      complete:() => {

      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      
    })
  }

  getBranches(){
    this.branchSerive.getAllBranches().subscribe({
      next:(data) => {
        this.branchesVM = data;
      },
      complete:() => {

      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    })
  }

  getBranchesStock(){
    this.stockService.Get().subscribe({
      next:(data) => {
        console.log(data);
        this.branchesStock = data;
      },
      complete:() => {

      },
      error:(error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    })
  }

  transferCards() {
    if(this.form.invalid){
      //fire invalid
      return;
    }
    this.transfer = this.form.value;
    console.log(this.transfer);
    this.stockService.TransferCards(this.transfer).subscribe({
      next:(data) => {
        console.log(data);
        Swal.fire({
          position: "center",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 2500
        });
      }, 
      complete:() => {
        this.getBranchesStock();
        
      },
       error:(error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.error.message,
          });
      }
    })
  }

  checkEqaulitySource(event:any){
    this.sourceBranch = event.target.value;
    if(this.sourceBranch == this.targetBranch){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't transfer to the same branch!",
      });
      this.form.get('sourceStock')?.setValue('');
    }
  }

  checkEqaulityTarget(event:any){
    this.targetBranch = event.target.value;
    if(this.sourceBranch == this.targetBranch){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't transfer to the same branch!",
      });
      this.form.get('targetStock')?.setValue('');
    }
  }

}
