export interface CardVm {
    cardType:string;
    message:string;
    pan:string;
    branchNameRequesting:string;
    userNameRequesting:string;
}
export interface ThePercentageOfCardsPrintedEachYearDTO {
  year: number;
  totalSucceededCards: number;
  totalDamagedCards: number;
}
export interface CardReportPerSpecificPeriodDto
{
  specificPeriod:string;
  successCards:number;
  damageCards:number;
}

export interface   CardReportPieChartRequest
 {
     specidficPeriodType:string;
     selectedPeriod:string;

 }
 export interface PrintedCardsReportPerBranches
 {
  branchName:string;
  successCards:number;
  damageCards:number;
 }
export interface CardsForUserQuerySearch {
  userName: string|null;
  dates: string[]|null;
  cardHolderName: string|null;
  maskedPan: string|null;
  cardStatus: number|null;
  pageNumber: number;
  pageSize: number;
}
export interface PrintedCardsForUser {
  maskedPan: string;
  cardHolderName: string;
  printedDate?: string;
  cardStatus?: number;
  productName: string;
}
export interface PrintedCardsPageResult {
  data: PrintedCardsForUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
 export interface PrintedCardsReportPerProducts
 {
  productName:string;
  successCards:number;
  damageCards:number;
 }
export interface CardTransactionFilteration {
  productId: number|null;
  branchName: string|null;
  transactionId:number|null;
  maskedPan:string|null;
  page:number|null;
  pageSize:number|null;
}
export interface CardTransactionDto {
  id: number | null;
  maskedPan: string | null;
  branchName: string | null;
  status: number | null;
  batchId: number | null;
  branchId: number | null;
  transactionId: number | null;

  productId:number|null;
  cardTransactionStatus: number | null;
}
export interface CardsForUserQuerySearch {
  userName: string|null;
  dates: string[]|null;
  cardHolderName: string|null;
  maskedPan: string|null;
  cardStatus: number|null;
  pageNumber: number;
  pageSize: number;
}
export interface PrintedCardsForUser {
  maskedPan: string;
  cardHolderName: string;
  printedDate?: string;
  cardStatus?: number;
  productName: string;
}
export interface PrintedCardsPageResult {
  data: PrintedCardsForUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
