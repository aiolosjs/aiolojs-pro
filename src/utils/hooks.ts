import { useState } from 'react';

export interface IQueryFormParams {
  form?: {
    [key: string]: any;
  };
  query?: {
    [key: string]: any;
  };
  pagination?: {
    [key: string]: any;
  };
}
export interface IQueryFormParamsResult {
  setQuery: (query: object) => void;
  setFormAdd: (form: object) => void;
  setFormUpdate: (form: object) => void;
  setPagination: (page: object) => void;
}
export function useQueryFormParams(
  payload: IQueryFormParams = {},
): [IQueryFormParams, IQueryFormParamsResult] {
  const defaultPagination = { pageSize: 10, current: 1 };
  const [params, setParams] = useState<IQueryFormParams>({
    form: {},
    query: {},
    pagination: { ...defaultPagination },
    ...payload,
  });

  function setQuery(query = {}) {
    setParams(p => ({ ...p, form: {}, query: { ...query }, pagination: { ...defaultPagination } }));
  }

  function setFormAdd(form = {}) {
    setParams(p => ({ ...p, query: {}, form: { ...form }, pagination: { ...defaultPagination } }));
  }

  function setFormUpdate(form = {}) {
    setParams(p => ({ ...p, form: { ...form } }));
  }

  function setPagination(page = {}) {
    setParams(p => ({ ...p, form: {}, pagination: { ...defaultPagination, ...page } }));
  }

  return [params, { setQuery, setFormAdd, setFormUpdate, setPagination }];
}
