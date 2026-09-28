import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';
import { MakeTransactionDto, ProductTransactionDto, TransactionsFilters, TransactionVm } from 'src/app/ViewModels/ItransactionVm';
import { TransactionAddVm } from 'src/app/ViewModels/transaction-add-vm';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;




  // new methods
  addNewTransaction(payload: MakeTransactionDto) {
    return this.http.post(`${this.baseLink}Transactions`, payload);
  }
    getAllTransactions(filter: TransactionsFilters): Observable< PageResult<TransactionVm>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);

    if (filter.source) {
      params = params.set('source', filter.source);
    }

    if (filter.destination) {
      params = params.set('destination', filter.destination);
    }

    if (filter.transactionStatus?.length) {
      filter.transactionStatus.forEach(s => {
        params = params.append('transactionStatus', s);
      });
    }

    if (filter.requestDateRange?.length === 2) {
      params = params.append('requestDateRange', filter.requestDateRange[0]);
      params = params.append('requestDateRange', filter.requestDateRange[1]);
    }

    if (filter.recivedDateRange?.length === 2) {
      params = params.append('recivedDateRange', filter.recivedDateRange[0]);
      params = params.append('recivedDateRange', filter.recivedDateRange[1]);
    }

    if (filter.acceptDeclinedDateRange?.length === 2) {
      params = params.append('acceptDeclinedDateRange', filter.acceptDeclinedDateRange[0]);
      params = params.append('acceptDeclinedDateRange', filter.acceptDeclinedDateRange[1]);
    }

    return this.http.get< PageResult<TransactionVm>>(this.baseLink + 'Transactions/All', { params });
  }
  getTransactionById(transactionId: number):Observable<TransactionVm> {
    return this.http.get<TransactionVm>(
      `${this.baseLink}Transactions/get-by-id`,
      {
        params: { tranactionId: transactionId }
      }
    );
  }
  GetTransactionProducts(transactionId:number):Observable<ProductTransactionDto[]>
  {
    return this.http.get<ProductTransactionDto[]>(`${this.baseLink}Transactions/transaction-Products?transactionId=${transactionId}`)
  }
  receiveTransaction(payload: MakeTransactionDto): Observable<any> {
    return this.http.post(`${this.baseLink}Transactions/recived-transaction`, payload);
  }
  undoTransaction(dto: TransactionVm): Observable<any> {
  return this.http.put(`${this.baseLink}Transactions`, dto);
}

}
