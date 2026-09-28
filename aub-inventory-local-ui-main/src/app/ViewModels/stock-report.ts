export interface StockReport {
    // branchName:string;
    // productName:string;
    // cardAmount:number;
    // lowBranchCardAmount:number;
    // mediumBranchCardAmount:number;

    branchName: string;
    allProductsStock: { [key: string]: number };
    inStockProducts: { [key: string]: number };
    utillizedProducts: { [key: string]: number };
    lowCardAmount: number;
    mediumCardAmount: number;
  
}