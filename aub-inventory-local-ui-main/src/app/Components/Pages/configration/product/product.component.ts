import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/Services/Product/product.service';
import { ProductQuantityPutVM } from 'src/app/ViewModels/product-quantity-vm';
import { ProductVM, ProductVMRequest } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  constructor(private fb:FormBuilder,private productService:ProductService){}
  ngOnInit(): void {
    this.getProducts();
    this.initProductForm();
  }
  products:ProductVM[] = [];
  productForm!:FormGroup;
  initProductForm(){
    this.productForm = this.fb.group({
      productName:['',Validators.required],
      lowProductQuantity:['',Validators.required],
      highProductQuantity:['',Validators.required],
    });
  }
  getProducts(){
    this.productService.Get().subscribe({
      next:(data:any)=>{this.products = data,console.log(data)},
      error:(err)=>{console.log(err)},
      complete:()=>{}
    })
  }
  submitProductForm(){
    let product:ProductVMRequest = {id:Number(this.productForm.get("productName")?.value),highProductQuantity:this.productForm.get("highProductQuantity")?.value,lowProductQuantity:this.productForm.get("lowProductQuantity")?.value}

    if(product.highProductQuantity<=product.lowProductQuantity){
      Swal.fire({
        icon:"error",
        title:"Invalid Input",
        text:"High Product Quantity Can't be less than or equal Low Product Quantity",
        confirmButtonColor:"#dc3545",
      })
    }else{
      this.productService.updateProductQuantity(product).subscribe({
        next:(data:any)=>{this.initProductForm();},
        error:(err)=>{
          console.log(err)
        },
        complete:()=>{
          Swal.fire({
            icon:"success",
            title:"Quantity Added Successfully",
            showConfirmButton:false,
            timer:2000,
          })
        }
      })
    }

  }

}
