import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCardVm } from 'src/app/ViewModels/request-card-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class RequestCardsService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;

  requestCardsLink = this.baseLink + "CardRequest/RequestCards";
  requestCards(requestCard:RequestCardVm){
    return this.http.post(this.requestCardsLink,requestCard)
  }
  getRequestCardsLink = this.baseLink + "CardRequest/GetRequestedCards";
  getRequestedCards(){
    return this.http.get(this.getRequestCardsLink);
  }
  getRequestCardsForBranchLink = this.baseLink + "CardRequest/GetRequestedCardsForBranch";
  getRequestedCardsForBranch(branchName:string ){
    return this.http.get(this.getRequestCardsForBranchLink,{
      params:{
        "branchName":branchName,
      }
    });
  }
  updaterequestCardsToConfirmedLink = this.baseLink + "CardRequest/UpdateRequestToConfirmed";
  updaterequestCardsToConfirmed(requestCard:RequestCardVm){
    return this.http.put(this.updaterequestCardsToConfirmedLink,requestCard)
  }
  updaterequestCardsToDeclinedLink = this.baseLink + "CardRequest/UpdateRequestToDeclined";
  updaterequestCardsToDeclined(requestCard:RequestCardVm){
    return this.http.put(this.updaterequestCardsToDeclinedLink,requestCard)
  }
}
