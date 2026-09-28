import { CardVm } from "./card-vm";
import { TransactionAddVm } from "./transaction-add-vm";

export interface ReportVm {
    cards:CardVm[];
    transactions:TransactionAddVm[];
}
export interface BranchCardsReport {
  branchName: string;
  successCards: number;
  damagedCards: number;
  pendding: number;
}
