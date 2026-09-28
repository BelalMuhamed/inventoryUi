export interface IUserModel {
    username:string;
    password:string;
    branchName:string;
}


export interface IAUBUsersParams {
  search: string|null;
  pageNumber: number;
  pageSize: number;
}
