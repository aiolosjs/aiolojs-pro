export type OperatorKeys = 'fetch' | 'create' | 'update' | 'updatePassword' | 'changeStatus';
export type OperatorType = { [K in OperatorKeys]?: string };
