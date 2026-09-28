import { Observable, retry } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.production';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PrintConfiguration } from 'src/app/ViewModels/imachine-configs';
import { PrintConfigForSpecificFaceReq, ProductPrintConfigVM } from 'src/app/ViewModels/ProductPrintConfigVM';

@Injectable({
  providedIn: 'root'
})
export class PrintconfigsService {

   constructor(private http:HttpClient) { }
     baseLink = environment.baseLink;
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
     //#
     UpdatePrintConfigForSpecificProduct(_req:ProductPrintConfigVM):Observable<any>
     {
       return this.http.put<any>(
      `${this.baseLink}PrintConfigurations/Edit-Print-Config-For-Specific-Product`,
      _req
    );
     }
     //#endregion
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
}
