import { ProductWithCardAmountAddVM } from "./product-with-card-amount-add-vm";

export interface StockAddVM {
    id:number;
    branchName:string;
    productNamesWithCardAmount:ProductWithCardAmountAddVM[];
}
