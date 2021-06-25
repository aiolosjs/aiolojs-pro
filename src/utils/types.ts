import { PaginationConfig } from 'antd/lib/pagination';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;

export interface IPagination {
  total?: number;
  current?: number;
  pageSize?: number;
  pageTotal?: number;
}

export interface ITableData<T> {
  list: T[];
  pagination: IPagination;
}

export interface DvaLoadingState {
  global: boolean;
  models: Record<string, boolean | undefined>;
  effects: Record<string, boolean | undefined>;
}
