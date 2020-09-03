/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 *
 */
import defaultSettings from './defaultSettings';

const { debugLocal, debugLocalDomain } = defaultSettings;

const targetSysUrl = debugLocal ? debugLocalDomain : 'http://yapi.ishanggang.com/mock/22';
const targetApiUrl = debugLocal ? debugLocalDomain : 'http://yapi.rebornauto.cn/mock/112';

export default {
  '/api/sys': {
    target: targetSysUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
  '/sys': {
    target: targetSysUrl,
    changeOrigin: true,
  },
  '/api': {
    target: targetApiUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
};
