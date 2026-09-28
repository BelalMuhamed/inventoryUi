export interface PrintConfigRespDto {
  productName: string;
  // front, back
  printedFace: number;
  fontFamily: string;
  fontSize: number;
  printColor: string;
  riponType: string;
  x: number;
  y: number;
  image: string ;
  // landscape, portrait
  printWay: number;
  // ltr, rtl
  backGroundColor:string;
  fontStyle:string;
}
export interface AllReqFilterations {
  pageIndex: number;
  pageSize: number;
  productName: string|null;
}
