import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CardReportVm } from 'src/app/ViewModels/card-report-vm';
import { PerformanceMetricVm } from 'src/app/ViewModels/performance-metric-vm';
import { StockReport } from 'src/app/ViewModels/stock-report';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;

  private exportTransactionToExcelLink = this.baseLink + "ExcelFiles/ExportTransactionToExcel";
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  exportTransactionsToExcel(transactions:TransactionGetVm[]){
    
    return this.http.post<Blob>(this.exportTransactionToExcelLink,transactions,{ headers: this.headers, responseType: 'blob' as 'json' })
  }

  private exportStockToExcelLink = this.baseLink + "ExcelFiles/ExportStockToExcel"
  exportStockToExcel(stock:StockReport[]){
    return this.http.post<Blob>(this.exportStockToExcelLink,stock,{ headers: this.headers, responseType: 'blob' as 'json' })
  }
  private exportCardsToExcelLink = this.baseLink + "ExcelFiles/ExportCardsToExcel"
  exportCardsToExcel(cards:CardReportVm[]){
    return this.http.post<Blob>(this.exportCardsToExcelLink,cards,{ headers: this.headers, responseType: 'blob' as 'json' })
  }

  private exportPerformanceToExcelLink = this.baseLink + "ExcelFiles/ExportPerformanceToExcel"
  exportPerformanceToExcel(metrics:PerformanceMetricVm){
    return this.http.post<Blob>(this.exportPerformanceToExcelLink,metrics,{ headers: this.headers, responseType: 'blob' as 'json' })
  }
}
