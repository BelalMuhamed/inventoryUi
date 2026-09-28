import { ProductWithCardAmountReadVM } from "./product-with-card-amount-read-vm";

export interface StockReadVM {
    id:number;
    branchName:string;
    productsWithAmount:ProductWithCardAmountReadVM[];
}
export interface productStockDto
{
  productName:string,
  quantity:number,
  holdAmount:number
}
export interface ProductStockDetailsPerBranchesDto
{
  branchName:string,
  quantity:number
}
