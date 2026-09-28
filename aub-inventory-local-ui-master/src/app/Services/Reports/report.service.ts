import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardReportSearchVm } from 'src/app/ViewModels/card-report-search-vm';
import { cardAmountPerBranch, CardReportVm } from 'src/app/ViewModels/card-report-vm';
import { StockReportSearchVm } from 'src/app/ViewModels/stock-report-search-vm';
import { TransactionReportSearchVm } from 'src/app/ViewModels/transaction-report-search-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;

  private FilterCardSearchLink = this.baseLink + "Report/FilterCardSearchReport";
  FilterCardSearch(requestCardSearch:CardReportSearchVm){
    return this.http.post(this.FilterCardSearchLink,requestCardSearch);
  }
  private GetCardsPaginationLink = this.baseLink + "Report/GetCardsPagination";
  GetCardsPagination(branchName:string,pageIndex:number,pageSize:number){
    return this.http.get(this.GetCardsPaginationLink,{
      params:{
        "branchName":branchName,
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }
  private GetCardsReportTotalSizeLink = this.baseLink + "Report/GetCardsReportTotalSize"
  GetCardsReportTotalSize(branchName:string){
    return this.http.get(this.GetCardsReportTotalSizeLink,{
      params:{
        "branchName":branchName,
      }
    });
  }
  private GetSearchedCardsPaginationLink = this.baseLink + "Report/GetSearchedCardsPagination";
  GetSearchedCardsPagination(cards:CardReportSearchVm,pageIndex:number,pageSize:number){
    return this.http.post(this.GetSearchedCardsPaginationLink,cards,{
      params:{
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }


  private GetTransactionsPaginationLink = this.baseLink + "Report/GetTransactionsPagination";
  GetTransactionsPagination(branchName:string,pageIndex:number,pageSize:number){
    return this.http.get(this.GetTransactionsPaginationLink,{
      params:{
        "branchName":branchName,
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }
  private GetSearchedTransactionPaginationLink = this.baseLink + "Report/GetSearchedTransactionPagination";
  GetSearchedTransactionPagination(transactions:TransactionReportSearchVm,pageIndex:number,pageSize:number){
    return this.http.post(this.GetSearchedTransactionPaginationLink,transactions,{
      params:{
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }

  private GetTransactionReportTotalSizeLink = this.baseLink + "Report/GetTransactionReportTotalSize"
  GetTransactionReportTotalSize(branchName:string){
    return this.http.get(this.GetTransactionReportTotalSizeLink,{
      params:{
        "branchName":branchName
      }
    });
  }

  private FilterTransactionSearchLink = this.baseLink + "Report/FilterTransactionSearchReport";
  FilterTransactionSearch(requestCardSearch:TransactionReportSearchVm){
    return this.http.post(this.FilterTransactionSearchLink,requestCardSearch);
  }



  private FilterStockSearchLink = this.baseLink + "Report/FilterStockSearchReport";
  FilterStockSearch(stockReportSearch:StockReportSearchVm){
    return this.http.post(this.FilterStockSearchLink,stockReportSearch);
  }
  private GetStockPaginationLink = this.baseLink + "Report/GetStocksPagination";
  GetStockPagination(branchName:string,pageIndex:number,pageSize:number){
    return this.http.get(this.GetStockPaginationLink,{
      params:{
        "branchName":branchName,
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }
  private GetSearchedStockPaginationLink = this.baseLink + "Report/GetSearchedStocksPagination";
  GetSearchedStocksPagination(stocks:StockReportSearchVm,pageIndex:number,pageSize:number){
    return this.http.post(this.GetSearchedStockPaginationLink,stocks,{
      params:{
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }
  private GetStocksReportTotalSizeLink = this.baseLink + "Report/GetStockReportTotalSize"
  GetStocksReportTotalSize(branchName:string){
    return this.http.get(this.GetStocksReportTotalSizeLink,{
      params:{
        "branchName":branchName
      }
    });
  }


  private getStocksWithProductsLink = this.baseLink + "Report/GetStocksWithProducts"
  getStocksWithProducts(pageIndex:number,pageSize:number){
    return this.http.get(this.getStocksWithProductsLink,{
      params:{
        "pageIndex":pageIndex,
        "pageSize":pageSize,
      }
    })
  }

  private getPerformanceMetricsLink = this.baseLink + "Report/GetPreformanceMetrics"
  getPerformanceMetrics(){
    return this.http.get(this.getPerformanceMetricsLink)
  }
  private filterPerformanceLink = this.baseLink + "Report/FilterPerformanceReport";
  filterPerformanceByBranch(branchName:string,year:number){
    return this.http.post(this.filterPerformanceLink,{},{

      params:{
        "branchName":branchName,
        "year":year,
      }
    });
  }


  GetCardsCountByStatus(status:number):Observable<any>
  {
    return this.http.get(this.baseLink+`Report/get-cards-count-by-status?status=${status}`,{responseType:'text'});
  }
  GetCardAmountForSpecificProductPerBranch(productId:Number):Observable<cardAmountPerBranch[]>
  {
    return this.http.get<cardAmountPerBranch[]>(this.baseLink+`Report/get-cards-amount-per-branch?productId=${productId}`);

  }
}
