export interface BranchRequestFilteration {
  pageIndex: number;
  pageSize: number;
  askedRequestUser: string|null;
  dates: string[];
  status: number[]|null;
  branchName:string|null;

}
export interface BranchRequestDto {
  id: number;
  destination: string|null;
  requestDate: string|null;
  acceptDeclinedDate: string|null;
  transactionStatus: number|null;
  askingTransactionUser: string|null;
  acceptRequestUser: string | null;
}
export interface BranchProductsDto {
  requestId: number;
  productId: number;
  productName: string;
  askedQuantity: number;
}
