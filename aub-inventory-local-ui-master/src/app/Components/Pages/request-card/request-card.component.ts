import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ProductService } from 'src/app/Services/Product/product.service';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { ProductVM } from 'src/app/ViewModels/product-vm';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent implements OnInit{
  //private requestCardConnection:HubConnection;
  constructor(private fb:FormBuilder, private cardRequestService:RequestCardsService,private productsService:ProductService){
    //this.requestCardConnection = new HubConnectionBuilder().withUrl("https://localhost:7193/requestCardHub").build()
  }
  products:ProductVM[] = []
  branchRequesting:string = '';
  usernameRequesting:string = ''; 

  ngOnInit(): void {
    this.branchRequesting = localStorage.getItem("branchName")||"";
    this.usernameRequesting = localStorage.getItem("username")||"";
    // this.requestCardConnection.start()
    // .then(()=>{this.subscribeToRequestCardNotification()})
    // .catch(err => console.error(err));

    this.getProducts();
    this.initRequestCardForm();
  }
  requestCardsForm!:FormGroup;
  initRequestCardForm(){
    this.requestCardsForm = this.fb.group({
      cardsType:['',Validators.required],
      cardAmount:[,[Validators.required,Validators.min(1)]],
      
    })
  }
  // subscribeToRequestCardNotification(){
  //   this.requestCardConnection.on("requestCard",(requestCard:any)=>{
  //     console.log(requestCard);
  //   });
  // }

  getRequestedCards(){
    this.cardRequestService.getRequestedCards().subscribe({
      next:(data:any)=>{}
    })
  }
  getProducts(){
    this.productsService.getProducts().subscribe({
      next:(data:any)=>{this.products=data,console.log(data)},
      error:(err)=>console.log(err),
      complete:()=>{console.log("get products done")}
    })
  }
  sendRequest(){
    this.requestCardsForm.addControl('branchNameRequesting',new FormControl(this.branchRequesting))
    this.requestCardsForm.addControl('userNameRequesting',new FormControl(this.usernameRequesting))
    console.log(this.requestCardsForm.value);
    this.cardRequestService.requestCards(this.requestCardsForm.value).subscribe({
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("Send request done");
      Swal.fire({
        title:"Success",
        icon:"success",
        text:"Request Sent Successfully",
        timer:2000,
        showConfirmButton:false
      })
    }
    })
  }


  get cardsType() { return this.requestCardsForm.get('cardsType'); }
  get cardAmount() { return this.requestCardsForm.get('cardAmount'); }

}
