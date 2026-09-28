export interface TransactionGetVm {
        id:number;
        source?:string;
        destination:string;
        transactionDate:string,
        cardAmount:number;
        userName:string;
        productName:string;
        transactionStatus:any;
        cardRequestId:number;
}
