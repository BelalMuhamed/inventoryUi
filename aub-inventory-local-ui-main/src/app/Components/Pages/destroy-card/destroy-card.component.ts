import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CardsService } from 'src/app/Services/Cards/cards.service';
import { ProductService } from 'src/app/Services/Product/product.service';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destroy-card',
  templateUrl: './destroy-card.component.html',
  styleUrls: ['./destroy-card.component.css']
})
export class DestroyCardComponent implements OnInit {
  
  constructor(private productsService:ProductService,private fb:FormBuilder,private cardService:CardsService){}
  ngOnInit(): void {
    this.getProducts();
    this.initDestroyCardForm();
  }
  products:ProductVM[] = []
  destroyCardForm!:FormGroup
  branchReporting:string = '';
  usernameReporting:string = ''; 
  initDestroyCardForm(){
    this.branchReporting = localStorage.getItem("branchName")||"";
    this.usernameReporting = localStorage.getItem("username")||"";
    this.destroyCardForm = this.fb.group({
      cardType:['',Validators.required],
      PAN:[,[Validators.required,Validators.minLength(16), Validators.maxLength(16)]], // 16 digit pattern
      message:['',Validators.required],
    })
  }

  getProducts(){
    this.productsService.getProducts().subscribe({
      next:(data:any)=>{this.products=data,console.log(data)},
      error:(err)=>console.log(err),
      complete:()=>{console.log("get products done")}
    })
  }
  updateCardDestroy(){
    this.destroyCardForm.addControl('branchNameRequesting',new FormControl(this.branchReporting))
    this.destroyCardForm.addControl('userNameRequesting',new FormControl(this.usernameReporting))
    this.destroyCardForm.patchValue({'PAN':this.destroyCardForm.get("PAN")?.value.toString()})
    console.log(this.destroyCardForm.value);
    this.cardService.updateDestroyCard(this.destroyCardForm.value).subscribe({
      next:(data:any)=>{console.log(data)},
      error:(err)=>{
        console.log(err);
        //error:{cardNotFound: true, title: 'Card Not Found', description: 'Please make sure you typed right PAN and card already exists!'}
        if(err.error.cardNotFound){
          Swal.fire({
            title: err.error.title,
            icon:"error",
            text:err.error.description
          })    
        }else{
          Swal.fire({
            title: "Something Went Wrong",
            icon:"error",
            text:err.error || err.errors || err.error.errorMessage
          })
        }
      },
      complete:()=>{console.log("Destroy Sent");
      Swal.fire({
        title:"Success",
        icon:"success",
        text: "Card Reported Successfully",
        timer:2000,
        showConfirmButton:false
      })
    }
    })
  }


  get pan() { return this.destroyCardForm.get('PAN'); }
  get cardType() { return this.destroyCardForm.get('cardType'); }
  get message() { return this.destroyCardForm.get('message'); }
}
