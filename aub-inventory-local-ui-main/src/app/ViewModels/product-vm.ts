export interface ProductVM {
    id:number;
    productName:string;
    productStatus:string;
    Printeditems:number|null;
}
export interface ProductVMRequest {


    id:number;
    lowProductQuantity:number;
    highProductQuantity:number;
}
export interface Product {
    id:number;
    productName:string;
    productStatus:number;
}
export interface SelectedProductFromSelectBox
{
  id:number;
  productName:string;
}
