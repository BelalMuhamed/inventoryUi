import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BranchProductsDto, BranchRequestDto, BranchRequestFilteration } from 'src/app/Model/BranchRequest/IBranchRequest';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';
import { AddRequestCardDto, RequestCardVm } from 'src/app/ViewModels/request-card-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class RequestCardsService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;
//#region to remove
  requestCardsLink = this.baseLink + "CardRequest/RequestCards";
  requestCards(requestCard:RequestCardVm){
    return this.http.post(this.requestCardsLink,requestCard)
  }
  getRequestCardsLink = this.baseLink + "CardRequest/GetRequestedCards";
  getRequestedCards(){
    return this.http.get(this.getRequestCardsLink);
  }
  getRequestCardsForBranchLink = this.baseLink + "CardRequest/GetRequestedCardsForBranch";

  updaterequestCardsToConfirmedLink = this.baseLink + "CardRequest/UpdateRequestToConfirmed";
  updaterequestCardsToConfirmed(requestCard:RequestCardVm){
    return this.http.put(this.updaterequestCardsToConfirmedLink,requestCard)
  }
  updaterequestCardsToDeclinedLink = this.baseLink + "CardRequest/UpdateRequestToDeclined";
  updaterequestCardsToDeclined(requestCard:RequestCardVm){
    return this.http.put(this.updaterequestCardsToDeclinedLink,requestCard)
  }
  //#endregion
addRequest(request: AddRequestCardDto): Observable<any> {
    return this.http.post(`${this.baseLink}CardRequest/add-request`, request);
  }
getRequestes(filters: BranchRequestFilteration): Observable<PageResult<BranchRequestDto>> {
  let params = new HttpParams()
    .set('pageIndex', filters.pageIndex)
    .set('pageSize', filters.pageSize);

  if (filters.askedRequestUser) {
    params = params.set('askedRequestUser', filters.askedRequestUser);
  }

  // ✅ أضف branchName هنا
  if (filters.branchName) {
    params = params.set('branchName', filters.branchName);
  }

  if (filters.dates && filters.dates.length === 2) {
    params = params
      .set('Dates', filters.dates[0])
      .append('Dates', filters.dates[1]);
  }

  if (filters.status && filters.status.length > 0) {
    filters.status.forEach(s => {
      params = params.append('status', s);
    });
  }

  return this.http.get<PageResult<BranchRequestDto>>(
    `${this.baseLink}CardRequest/Get-Branch-Requests`,
    { params }
  );
}

  getProductsInRequest(transId: number): Observable<BranchProductsDto[]> {
  return this.http.get<BranchProductsDto[]>(`${this.baseLink}CardRequest/get-request-products?reqID=${transId}`);
}
updateTransaction(id: number, transactionData: BranchRequestDto) {
    return this.http.put(`${this.baseLink}CardRequest/${id}`, transactionData)
      .pipe(
        catchError(this.handleError)
      );
  }
getRequestById(id: number):Observable<BranchRequestDto> {
  return this.http.get<BranchRequestDto>(`${this.baseLink}CardRequest/request?id=${id}`);
}

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unexpected error occurred';

    if (error.status === 0) {
      errorMsg = 'Cannot connect to the server. Please check your network.';
    }
    else if (error.status === 404) {
      errorMsg = 'Transaction not found.';
    }
    else if (error.status === 409) {
      errorMsg = 'Conflict occurred while updating. Another user might have changed this record.';
    }
    else if (error.status === 500) {
      errorMsg = error.error || 'Internal server error.';
    }
    else if (error.error?.message) {
      errorMsg = error.error.message;
    }

    console.error('Error:', error);
    return throwError(() => new Error(errorMsg));
  }
}
