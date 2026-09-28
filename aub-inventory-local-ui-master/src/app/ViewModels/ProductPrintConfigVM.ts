export interface ProductPrintConfigVM
{
  productName:string;
  printedFace:number;
  font:number;
  cpi:number;
  offSetX:number;
  offSetY:number;
  image:string;
}
export interface PrintConfigForSpecificFaceReq {
  productName: string;
  printedFace: number;
}
