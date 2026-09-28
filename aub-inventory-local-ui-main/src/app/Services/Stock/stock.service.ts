import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockAddVM } from 'src/app/ViewModels/stock-add-vm';
import { ProductStockDetailsPerBranchesDto, productStockDto, StockReadVM } from 'src/app/ViewModels/stock-read-vm';
import { TransferPutVM } from 'src/app/ViewModels/transfer-put-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  baseLink = environment.baseLink;
  constructor(private http:HttpClient) { }

  Get() : Observable<StockReadVM[]>{
    return this.http.get<StockReadVM[]>(this.baseLink + "Stock/");
  }

  GetBranchStock(branchName:string|null) : Observable<StockReadVM>{
    return this.http.get<StockReadVM>(this.baseLink + 'Stock/BranchStock?branchName=' + branchName);



}

  AddStock(stock:StockAddVM) : Observable<string> {
    return this.http.post<string>(this.baseLink+"Stock/",stock);
  }

  TransferCards(transfer:TransferPutVM) : Observable<any> {
    return this.http.put<any>(this.baseLink+"Stock/TransferCard/",transfer);
  }

  GetStockForEachProduct():Observable<productStockDto[]>
  {
    return this.http.get<productStockDto[]>(this.baseLink+"Stock/Get-Stock-By-Produt");
  }
  GetProductStockDetailsPerBranches(productName:string):Observable<ProductStockDetailsPerBranchesDto[]>
  {
    return this.http.get<ProductStockDetailsPerBranchesDto[]>(this.baseLink+`Stock/get-product-stock-details-per-branches?productName=${productName}`);
  }
   GetTotalCardsStock(status:number):Observable<number>
  {
    return this.http.get<number>(this.baseLink+`Card/Get-cards-count-by-status?status=${status}`);
  }
}
