import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, tap } from 'rxjs';
import { ProductQuantityPutVM } from 'src/app/ViewModels/product-quantity-vm';
import { Product, ProductVM, ProductVMRequest } from 'src/app/ViewModels/product-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseLink = environment.baseLink;
  constructor(private http:HttpClient) { }


  Get() : Observable<ProductVM[]> {
    return this.http.get<ProductVM[]>(this.baseLink + "Products/");
  }

  getProductsLink =this.baseLink + "Products/GetProductsDto";
  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.getProductsLink);
  }
  updateProductQuantityLink = this.baseLink+"Products/UpdateProductQuantity";

  updateProductQuantity(product:ProductVMRequest){
    return this.http.put(this.updateProductQuantityLink,product)
  }

  getProductsQuantityLink =this.baseLink + "Products/GetProductQuantity";
  getProductsQuantity(){
    return this.http.get(this.getProductsQuantityLink);
  }
  getProductsWithoutPrintConfig():Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.baseLink}Products/get-products-without-print-config`);
  }
}
