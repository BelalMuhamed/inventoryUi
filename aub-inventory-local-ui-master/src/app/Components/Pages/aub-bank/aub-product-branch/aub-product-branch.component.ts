import { Component } from '@angular/core';
import "sweetalert2"
import Swal from 'sweetalert2';
@Component({
  selector: 'app-aub-product-branch',
  templateUrl: './aub-product-branch.component.html',
  styleUrls: ['./aub-product-branch.component.css']
})
export class AUBProductBranchComponent {


  addProduct(){
    Swal.fire({
      title:"Add Product",
      input:"text",
      inputValidator: (value) => {
        if (value =="") {
          return 'Value cannot be empty!';
        }
        return;
      },
      confirmButtonText:"Add"
    }).then((result)=>{
      if(result.isConfirmed){
        const inputValue = result.value;
        console.log('Typed value:', inputValue);
      }
    })
  }
  addbranch(){
    Swal.fire({
      title:"Add Branch",
      input:"text",
      inputValidator: (value) => {
        if (value =="") {
          return 'Value cannot be empty!';
        }
        return;
      },
      confirmButtonText:"Add"
    }).then((result)=>{
      if(result.isConfirmed){
        const inputValue = result.value;
        console.log('Typed value:', inputValue);
      }
    })
  }
  products:string[] = ["10th of Ramadan","5th Setllment, New Cairo","Nasr City"];
  branches:string[] = ["AUB VISA GOLD","AUB MASTER PLATINIUM","AUB MEZA GOLD"];
}
