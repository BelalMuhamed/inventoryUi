import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionAddVm } from 'src/app/ViewModels/transaction-add-vm';
import { TransactionGetVm } from 'src/app/ViewModels/transaction-get-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;
  //requestCardsLink = this.baseLink + "Transactions/RequestCards";
  // requestCards(branchName:string,cardAmountRequested:string,userName:string){
  //   this.http.post(this.requestCardsLink,{},{
  //     params:{
  //       "branchName":branchName,
  //       "cardAmountRequested":cardAmountRequested,
  //       "UserName":userName
  //     }
  //   })
  // }

  private addTransactionLink =this.baseLink + "Transfers/AddTransaction";
  addTransaction(transaction:TransactionAddVm){
    return this.http.post(this.addTransactionLink,transaction);
  }

  private getTransactionsForBranchLink =this.baseLink + "Transfers/GetTransactionsForBranch";
  getTransactionsForBranch(branchName:string){
    return this.http.get(this.getTransactionsForBranchLink,{
      params:{
        "branchName":branchName
      }
    });
  }
  private updateTransactionToConfirmedLink =this.baseLink + "Transfers/UpdateTransactionToConfirmed";
  updateTransactionToConfirmed(transaction:TransactionGetVm){
    return this.http.put(this.updateTransactionToConfirmedLink,transaction);
  }
  private CheckCardsAmountInSourceBranchLink =this.baseLink + "Transfers/CheckCardsAmountInSourceBranch";
  CheckCardsAmountInSourceBranch(sourceBranchName:string,cardType:string,cardAmount:number){
    return this.http.post(this.CheckCardsAmountInSourceBranchLink,{},{
      params:{
        "sourceBranchName":sourceBranchName,
        "cardType":cardType,
        "cardAmount":cardAmount,
      }
    });
  }
  private getOnTransferTransactionsLink =this.baseLink + "Transfers/GetOnTransferTransactions";
  getOnTransferTransactions(){
    return this.http.get(this.getOnTransferTransactionsLink)
  }

  private UndoApprovedTransactionLink =this.baseLink + "Transfers/UndoApprovedTransaction";
  UndoApprovedTransaction(transaction:TransactionGetVm){
    return this.http.post(this.UndoApprovedTransactionLink,transaction);
  }
}
