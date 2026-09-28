export interface PerformanceMetricVm {
    performnceMetrics: { [key: string]: BranchesAnalytics; };
    
}
export interface BranchesAnalytics {
    cardsIssuedOnMonths: number[];
    cardsDamagedOnMonths: number[];
    cardsErroredOnMonths: number[];
    remainingStockProducts: { [key: string]: number; };
}
export interface BranchData {
    cardsIssuedOnMonths: number[];  // Assuming each array contains numbers
    cardsDamagedOnMonths: number[];
    cardsErroredOnMonths: number[];
    remainingStockProducts: { [key: string]: number; };

  }
  
export type Branches = {
    [branchName: string]: BranchData;
};
  