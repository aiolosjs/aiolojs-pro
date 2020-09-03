import { Settings as ProSettings } from '@ant-design/pro-layout';

const env = process.env.NODE_ENV;

type DefaultSettings = ProSettings & {
  pwa: boolean;
  debugLocal: boolean;
  debugLocalDomain: string;
  isLocalMenus: boolean;
};

const proSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '系统脚手架',
  pwa: false,
  debugLocal: false,
  debugLocalDomain: '',
  isLocalMenus: env === 'development',
} as DefaultSettings;

export type { DefaultSettings };

export default proSettings;
