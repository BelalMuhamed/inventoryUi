export interface RequestCardVm {
    id:number;
    cardsType:string;
    cardAmount:number;
    branchNameRequesting:string;
    userNameRequesting:string;
    cardCenterUserName:string;
    dateTime:string;
    status:string;
}
export interface AddRequestCardDto {
  destination: string|null;
  transactionStatus: number;
  askingTransactionUser: string|null;
  requestProduts: AddRequestProductDto[];
}

export interface AddRequestProductDto {
  productId: number;
  quantity: number;
  productTransactionStatus: number;
}
