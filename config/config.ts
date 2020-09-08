// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import pageRouter from './router.config';
import proxy from './proxy';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: pageRouter,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: defaultSettings.title,
  ignoreMomentLocale: true,
  proxy,
  manifest: {
    basePath: '/',
  },
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // 设置 alias
    memo.resolve.alias.set('config', __dirname);
  },
});
