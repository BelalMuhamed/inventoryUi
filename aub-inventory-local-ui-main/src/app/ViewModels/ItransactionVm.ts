import { CardTransactionDto } from "./card-vm";

//last version of transaction
export interface TransactionVm {
  id: number;
  source: string | null;
  destination: string|null;
  requestDate: string|null;
  recivedDate: string | null;
  acceptDeclinedDate: string | null;
  transactionStatus: number;
  askingTransactionUser: string|null;
  recivedUser: string | null;
  acceptRequestUser: string | null;
}

export interface ProductTransactionDto
{
  transactionId:number|null,
  productId:number,
  quantity:number|null,
  productName:string|null,
  productTransactionStatus:number,
  cardLastSixDigits:string|null

}
export interface MakeTransactionDto
{
  transaction:TransactionVm,
  transactionProducts:ProductTransactionDto[],
  transactionCards:CardTransactionDto[]
}
export interface TransactionsFilters
{
   source: string|null;
  destination: string|null;
  requestDateRange: string[]|null;
  recivedDateRange: string[]|null;
  acceptDeclinedDateRange: string[]|null;
  transactionStatus: number[]|null;
  page: number;
  pageSize: number;
}
