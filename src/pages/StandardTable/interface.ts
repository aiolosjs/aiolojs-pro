import type { DvaLoadingState } from '@/utils/types';
import type { StandardTableState } from './model';

export type OperatorKeys = 'fetch' | 'create' | 'update' | 'remove';
export type OperatorType = { [K in OperatorKeys]?: string };
export type IRootState = {
  standardtable: StandardTableState;
  loading: DvaLoadingState;
};
