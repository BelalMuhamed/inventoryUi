import { Observable, retry } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.production';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PrintConfiguration } from 'src/app/ViewModels/imachine-configs';
import { PrintConfigForSpecificFaceReq, ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';
import { AllReqFilterations, PrintConfigRespDto } from 'src/app/ViewModels/IPrintConfigDtos';
import { PageResult } from 'src/app/ViewModels/IAPiRsponse';

@Injectable({
  providedIn: 'root'
})
export class PrintconfigsService {

   RIBBON_TYPES: string[] = [
  'RC_YMCKO',
  'RC_YMCKOS',
  'RC_YMCKOK',
  'RC_YMCKOKOS',
  'RM_KO',
  'RM_KBLACK',
  'RM_KWHITE',
  'RM_KRED',
  'RM_KGREEN',
  'RM_KBLUE',
  'RM_KSCRATCH',
  'RM_KMETALSILVER',
  'RM_KMETALGOLD',
  'RM_KSIGNATURE',
  'RM_KWAX',
  'RM_KPREMIUM',
  'RM_HOLO'
];


   constructor(private http:HttpClient) { }
     baseLink = environment.baseLink;
      private data: any;

  setData(value: any) {
    this.data = value;
  }

  getData() {
    return this.data;
  }
//#region  Delete After Finish
    //#region  will be unused  TODO
     getPrintConfiguration(PrintedItem:string):Observable<any>
     {
        return this.http.get(`${this.baseLink}PrintConfigurations/EmbossingConfigs/details/${PrintedItem}`);
     }
     Update(Printconfig:PrintConfiguration):Observable<any>
     {
      return this.http.put(`${this.baseLink}PrintConfigurations/update`,Printconfig,{
  responseType: 'text'
})
     }
     //#endregion

     GetPrintConfigrationForSpecificProduct(productName:string):Observable<ProductPrintConfigVM[]>
     {
      return this.http.get<ProductPrintConfigVM[]>(`${this.baseLink}PrintConfigurations/Get-Print-Configuration-for-specific-Product?productName=${productName}`);
     }
     //#region Add Print Configuration For Specific Product
     AddPRintConfigForSpecificProduct(_req:ProductPrintConfigVM):Observable<any>
     {
      return this.http.post<any>(`${this.baseLink}PrintConfigurations/Add-print-Config-for-specific-product`,_req)
     }
     //#endregion

     UpdatePrintConfigForSpecificProduct(_req:ProductPrintConfigVM):Observable<any>
     {
       return this.http.put<any>(
      `${this.baseLink}PrintConfigurations/Edit-Print-Config-For-Specific-Product`,
      _req
    );
     }

     //#region Delete
     DeletePrintConfig(_req:ProductPrintConfigVM):Observable<any>
     {
      return this.http.delete(`${this.baseLink}PrintConfigurations`, {
      body: _req
    });
     }
     //#endregion
     //#region  get by id
     GetById(req:PrintConfigForSpecificFaceReq):Observable<ProductPrintConfigVM>
      {
         const params = new HttpParams()
        .set('productName', req.productName)
        .set('printedFace', req.printedFace);
        return this.http.get<ProductPrintConfigVM>(`${this.baseLink}PrintConfigurations/get-print-config-for-sepecific-face`,{params})
      }
     //#endregion
     //#endregion

     GetAllPrintConfig(req:AllReqFilterations):Observable<PageResult<PrintConfigRespDto>>
     {
        const params = new HttpParams()
    .set('pageIndex', req.pageIndex)
    .set('pageSize', req.pageSize)
    .set('productName', req.productName ?? '');

  return this.http.get<PageResult<PrintConfigRespDto>>(
    `${this.baseLink}PrintConfigurations/all-print-configurations`,
    { params }
  );
     }
     GetFonts():Observable<string[]>
     {
      return this.http.get<string[]>(`${this.baseLink}PrintConfigurations/Get-fonts`);
     }
     addNewPrintConfig(req: PrintConfigRespDto): Observable<any> {
    return this.http.post(`${this.baseLink}PrintConfigurations/add-new-print-config`, req);
  }
  DeleteProductPrintConfig(productName:string):Observable<any>
  {
    return this.http.delete(`${this.baseLink}PrintConfigurations/${productName}`);
  }

 updatePrintConfig(productName: string, config: PrintConfigRespDto): Observable<any> {
  return this.http.put(`${this.baseLink}PrintConfigurations/edit-print-config/${productName}`, config);
}
getPrintConfigByProductName(productName: string): Observable<PrintConfigRespDto> {
  return this.http.get<PrintConfigRespDto>(
    `${this.baseLink}PrintConfigurations/get-print-config/${productName}`
  );
}
    GetFontStyles():Observable<string[]>
     {
      return this.http.get<string[]>(`${this.baseLink}PrintConfigurations/get-font-styles`);
     }

}
