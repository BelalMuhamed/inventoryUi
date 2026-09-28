export interface TransactionReportSearchVm {
    branchSourceName:string;
    branchDestinationName:string;
    dates:string[];
    statuses:string[];
    pageIndex:number;
    pageSize:number;
}