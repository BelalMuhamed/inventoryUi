export interface CardReportVm {
    id:number;
    branchName:string;
    maskedPan:string;
    username:string;
    date:string;
    status:string;
    message:string;
    batchName:string;
    productName:string;
}
export interface cardAmountPerBranch
{
  branchName:string;
  cardAmount:number;
}

