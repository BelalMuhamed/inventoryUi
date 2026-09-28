import { CardsForUserQuerySearch, PrintedCardsPageResult, PrintedCardsReportPerProducts } from './../../ViewModels/card-vm';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardReportPerSpecificPeriodDto, CardReportPieChartRequest, CardVm, PrintedCardsReportPerBranches, ThePercentageOfCardsPrintedEachYearDTO } from 'src/app/ViewModels/card-vm';
import { BranchCardsReport } from 'src/app/ViewModels/report-vm';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private http:HttpClient) { }
  baseLink = environment.baseLink;

  private updateDestroyCardLink = this.baseLink + "Card/UpdateDestroyCard"
  updateDestroyCard(card:CardVm){
    return this.http.put(this.updateDestroyCardLink,card)
  }
  private getAllCardsLink = this.baseLink + "/Card/GetAllCards";
  getAllCards(){
    return this.http.get(this.getAllCardsLink);
  }
  GetCardCountByStatusForBranch():Observable<BranchCardsReport[]>
  {
    return this.http.get<BranchCardsReport[]>(this.baseLink+`Card/get-cards-count-by-status-for-branch`)
  }
  GetThePercentageOfCardsPrintedEachYear():Observable<ThePercentageOfCardsPrintedEachYearDTO[]>
  {
    return this.http.get<ThePercentageOfCardsPrintedEachYearDTO[]>(this.baseLink+'Card/The-Percentage-Of-Cards-Printed-Each-Year');
  }
  GetCardsCountByStatus(status:number):Observable<any>
  {
    return this.http.get(this.baseLink+`Card/Get-cards-count-by-status?status=${status}`)
  }
  GetCardsReportToChart(SpecificPeriod:string):Observable<CardReportPerSpecificPeriodDto[]>
  {
  return this.http.get<CardReportPerSpecificPeriodDto[]>(this.baseLink+`Card/get-cards-report-to-chart-for-specific-period?SpecificPeriod=${SpecificPeriod}`);
  }

  getPrintedCardsReport(req: CardReportPieChartRequest):Observable<PrintedCardsReportPerBranches[]> {
    let params = new HttpParams()
      .set('specidficPeriodType', req.specidficPeriodType)
      .set('selectedPeriod', req.selectedPeriod);

    return this.http.get<PrintedCardsReportPerBranches[]>(`${this.baseLink}Card/get-printed-cards--detils-per-selected-period-to-branches`, { params });
  }
  getPrintedCardForUser(QueryParams:CardsForUserQuerySearch):Observable<PrintedCardsPageResult>
  {
     let params = new HttpParams()
      .set('userName', QueryParams.userName ?? '')
      .set('pageNumber', QueryParams.pageNumber )
      .set('pageSize', QueryParams.pageSize);

    if (QueryParams.cardStatus !== undefined) {
      params = params.set('cardStatus', QueryParams.cardStatus ?? '');
    }
    if (QueryParams.cardHolderName) {
      params = params.set('cardHolderName', QueryParams.cardHolderName);
    }
    if (QueryParams.maskedPan) {
      params = params.set('maskedPan', QueryParams.maskedPan);
    }
    if (QueryParams.dates && QueryParams.dates.length === 2) {
      params = params.set('dates', QueryParams.dates[0])
                     .append('dates', QueryParams.dates[1]);
    }

    return this.http.get<PrintedCardsPageResult>(
      `${this.baseLink}Card/get-cards-for-user`,
      { params }
    );

  }
   getPrintedCardsReportForProducts(req: CardReportPieChartRequest):Observable<PrintedCardsReportPerProducts[]> {
    let params = new HttpParams()
      .set('specidficPeriodType', req.specidficPeriodType)
      .set('selectedPeriod', req.selectedPeriod);

    return this.http.get<PrintedCardsReportPerProducts[]>(`${this.baseLink}Card/get-printed-cards-detils-per-selected-period-to-products`, { params });
  }
}
