import defaultSettings from './defaultSettings';

const { debugLocal, debugLocalDomain } = defaultSettings;

const targetSysUrl = debugLocal ? debugLocalDomain : 'http://yapi.ishanggang.com/mock/22';
const targetApiUrl = debugLocal ? debugLocalDomain : 'http://yapi.yunxiaowei.cn/mock/74';

export default {
  '/api/mgmt/account/login': {
    target: targetSysUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
  '/api/common/image/code': {
    target: targetSysUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
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
