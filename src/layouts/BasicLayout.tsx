import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
  DefaultFooter,
  ProSettings,
} from '@ant-design/pro-layout';
import React, { useEffect, useState, useMemo } from 'react';
import { Link, connect, Dispatch, history } from 'umi';
import { Result, Button } from 'antd';
import RenderAuthorize from '@/components/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import { CurrentUser, UserNavMenu } from '@/models/user';

// eslint-disable-next-line import/no-unresolved
import defaultSettings from 'config/defaultSettings';

import logo from '../assets/logo.svg';

const { isLocalMenus, title } = defaultSettings;

const getFlatMenus = (menuData: UserNavMenu[] = []): UserNavMenu[] => {
  let menus: UserNavMenu[] = [];
  menuData.forEach((item) => {
    if (!item) {
      return;
    }
    menus.push(item);
    const child = item.children || item.routes;
    if (child) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      menus = menus.concat(getFlatMenus(child));
    }
  });
  return menus;
};

function formatter(data: any[] = []) {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
        return null;
      }
      const result = {
        ...item,
      };
      const child = item.routes;
      if (child) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const children = formatter(child);

        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter((item) => item);
}

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="对不起，你没有权限访问该页面"
    extra={
      <Button type="primary">
        <Link to="/user/login">登录</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  currentUser: CurrentUser;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const defaultFooterDom = (
  <DefaultFooter copyright={`${new Date().getFullYear()} ${title}`} links={[]} />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    currentUser: { nav = [] },
    route,
    location = {
      pathname: '/',
    },
  } = props;

  const [mySettings, setSetting] = useState<Partial<ProSettings> | undefined>(settings);

  const flatMenus = useMemo(() => {
    return isLocalMenus ? getFlatMenus(formatter(route.routes)) : getFlatMenus(nav);
  }, [nav]);

  const renderMenuData = isLocalMenus ? formatter(route.routes) : nav;

  const Authorized = useMemo(() => {
    const flatMenuKeys = flatMenus.map((menu) => menu.path).filter((path) => path);
    return RenderAuthorize(flatMenuKeys);
  }, []);

  useEffect(() => {
    // 默认跳转到第一个 menuType=2 的 路径
    function jumpToDefaultPath() {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of flatMenus) {
        const { menuType, path } = item;
        if (menuType === 2) {
          history.push(path);
          break;
        }
      }
    }

    if (location.pathname === '/') {
      jumpToDefaultPath();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(() => {
    return getAuthorityFromRouter(props.route.routes, location.pathname || '/');
  }, [props.route.routes, location.pathname]);

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ];
        }}
        itemRender={(currRoute, params, routes, paths) => {
          const first = routes.indexOf(currRoute) === 0;
          return first ? (
            <Link to={paths.join('/')}>{currRoute.breadcrumbName}</Link>
          ) : (
            <span>{currRoute.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={() => renderMenuData}
        rightContentRender={() => <RightContent />}
        {...props}
        {...mySettings}
      >
        <Authorized authority={authorized} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      {process.env.NODE_ENV === 'development' && (
        <SettingDrawer
          settings={mySettings}
          onSettingChange={(changeSetting) => setSetting(changeSetting)}
        />
      )}
    </>
  );
};

export default connect(({ global, settings, user }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
}))(BasicLayout);
