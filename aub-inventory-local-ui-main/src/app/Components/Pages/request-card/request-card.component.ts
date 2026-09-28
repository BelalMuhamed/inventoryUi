import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/Product/product.service';
import { RequestCardsService } from 'src/app/Services/RequestCardService/request-cards.service';
import { Product, ProductVM } from 'src/app/ViewModels/product-vm';
import { AddRequestCardDto } from 'src/app/ViewModels/request-card-vm';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
private RequestCardSubscription = new Subscription();
  private productUnSubscription = new Subscription();
  private productService = inject(ProductService);
  private RequestCardService = inject(RequestCardsService);

  requestProduts: FormArray;
  products: Product[] = [];

  constructor(private fb: FormBuilder,private router: Router) {
    this.requestProduts = this.fb.array([]);
  }

  ngOnInit() {
    this.GetProducts();
  }

  get productsForms() {
    return this.requestProduts.controls as FormGroup[];
  }

  addProduct() {
    if (this.requestProduts.length >= this.products.length) return;

    const productGroup = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      productTransactionStatus: [3],
    });

    this.requestProduts.push(productGroup);
  }

  removeProduct(index: number) {
    this.requestProduts.removeAt(index);
  }
save() {
  if (this.requestProduts.invalid) {
    // علشان تظهر رسائل الخطأ لكل العناصر
    this.requestProduts.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields (Product & Quantity).',
      confirmButtonColor: '#d33'
    });
    return;
  }
const AddedRequest: AddRequestCardDto = {
  requestProduts:this.requestProduts.value,
  askingTransactionUser:localStorage.getItem('username'),
  destination:localStorage.getItem('branchName'),
  transactionStatus:4
}
this.RequestCardSubscription.add(this.RequestCardService.addRequest(AddedRequest).subscribe({
  next:(res)=>{
    Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: 'Your product request has been saved successfully.',
    confirmButtonColor: '#3085d6',
    timer:4000
  });
  }
  ,error:(err)=>{
    Swal.fire({
    icon: 'error',
    title: 'error!',
    text: 'Your product request has not been saved successfully!',
    confirmButtonColor: '#aa0d1dff'
  });
  },
  complete:()=>{
    this.reloadComponent();
  }
}))



}


  GetProducts() {
    this.productUnSubscription.add(
      this.productService.getProducts().subscribe({
        next: (res) => {
          this.products = res;
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load products. Check your server connection!',
            confirmButtonColor: '#d33'
          });
        }
      })
    );
  }

 getAvailableProducts(currentIndex: number): Product[] {
    const selectedIds = this.requestProduts.controls
      .map((ctrl, i) => (i === currentIndex ? null : ctrl.get('productId')?.value))
      .filter(id => id != null)
      .map(id => Number(id));
    const selectedSet = new Set<number>(selectedIds);

    return this.products.filter(p => !selectedSet.has(p.id));
  }
reloadComponent() {
  this.requestProduts.clear(); // تمسح كل المنتجات
  this.GetProducts(); // تعيد تحميل المنتجات
}


}
