export interface PageResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
