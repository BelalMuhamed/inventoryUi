export interface ProductQuantityPutVM{
    id:number;
    lowProductQuantity:number;
    highProductQuantity:number;
}
export interface ProductQuantityGetVM{
    id:number;
    productName:string;
    lowProductQuantity:number;
    highProductQuantity:number;
}