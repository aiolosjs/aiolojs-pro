import { Settings as ProSettings } from '@ant-design/pro-layout';

const env = process.env.NODE_ENV;

type DefaultSettings = ProSettings & {
  pwa: boolean;
  debugLocal: boolean;
  debugLocalDomain: string;
  isLocalMenus: boolean;
};

const proSettings = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  menu: {
    locale: true,
  },
  title: '系统脚手架',
  pwa: false,
  debugLocal: true,
  debugLocalDomain: 'http://192.168.22.68:9000',
  isLocalMenus: env === 'development',
} as DefaultSettings;

export type { DefaultSettings };

export default proSettings;
