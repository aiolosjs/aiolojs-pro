import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { RenderFormItemProps } from '@/core/common/renderFormItem';
import { query } from '@/services/api';

export const whiteListPath = ['/account/settings'];

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
type ConfigRoutes = {
  path?: string;
  routes?: ConfigRoutes[];
};

export const asyncFn = (params: string): Promise<any> => {
  return query(params).then((res) => res.body);
};

export const delay = (timeout = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

const getFlatRoutePath = (router: ConfigRoutes[] = []): string[] => {
  let keys: string[] = [];
  router.forEach((item) => {
    if (!item.path) {
      return;
    }
    keys.push(item.path);
    if (item.routes) {
      keys = keys.concat(getFlatRoutePath(item.routes));
    }
  });
  return keys;
};

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

export const getAuthorityFromRouter = (
  router: ConfigRoutes[] = [],
  pathname: string,
): string | undefined => {
  const flatRoutePath = getFlatRoutePath(router);
  const routerPath = flatRoutePath.find((path) => {
    const execPath = path && pathRegexp(path).exec(pathname);
    return execPath ? path : null;
  });

  if (routerPath) return routerPath;
  return undefined;
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function formaterObjectValue(obj: any) {
  const newObj = {};
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return newObj;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key] === undefined ? '' : obj[key];
    }
  }
  return newObj;
}
export function formItemAddInitValue<T>(
  formItems: RenderFormItemProps[],
  currentItem: T,
): RenderFormItemProps[] {
  if (!currentItem || Object.prototype.toString.call(currentItem) !== '[object Object]') {
    return formItems;
  }
  return formItems.map((item) => ({
    ...item,

    // eslint-disable-next-line no-nested-ternary
    initialValue: item.initialValue
      ? item.initialValue
      : currentItem[item.name]
      ? currentItem[item.name]
      : null,
  }));
}

export function filterFormItemsByKey(
  array: RenderFormItemProps[] = [],
  filterKeys: string[] = [],
): RenderFormItemProps[] {
  let target = [...array];
  filterKeys.forEach((key) => {
    target = target.filter((item) => item.name !== key);
  });
  return target;
}

export function findFormItemsByKey(array: RenderFormItemProps[] = [], findKeys: string[] = []) {
  const target = [...array];
  const list: RenderFormItemProps[] = [];
  findKeys.forEach((key) => {
    const curItem = target.find((item) => item.name === key);
    if (curItem) {
      list.push(curItem);
    }
  });
  return list;
}
