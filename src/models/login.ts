import { Reducer } from 'redux';
import { routerRedux } from 'dva';
import { Effect } from 'dva';
import { message } from 'antd';

import { queryPost, query } from '@/services/api';

export interface LoginStateProps {
  loading?: boolean;
  type?: string;
  image?: string;
  key?: string;
  statusCode?: number;
  isRefreshCode?: boolean;
  mobileValid?: boolean;
  mobiles?: Array<{ key: string; value: string }>;
}

export interface LoginModelType {
  namespace: string;
  state: LoginStateProps;
  effects: {
    loginIn: Effect;
    mobileLoginIn: Effect;
    getImageCaptcha: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeStatus: Reducer<LoginStateProps>;
    save: Reducer<LoginStateProps>;
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    statusCode: 200,
    loading: false,
    isRefreshCode: false,
    mobileValid: false,
  },

  effects: {
    *loginIn({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          loading: true,
          isRefreshCode: false,
        },
      });
      Object.assign(payload, {
        mobileValid: true,
      });
      console.log('payload',payload);
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });

      const response = yield call(queryPost, formData, '/sys/login');

      const { code, body } = response;
      yield put({
        type: 'save',
        payload: {
          statusCode: code,
          isRefreshCode: code !== 200,
        },
      });
      yield put({
        type: 'changeStatus',
        payload: {
          loading: false,
        },
      });

      if (code === 200) {
        const { token } = body;
        localStorage.setItem('token', token);

        yield call(delay, 300);
        yield put(routerRedux.replace('/'));
      } else if (code === 202) {
        const { mobiles = [] } = body;

        yield put({
          type: 'save',
          payload: {
            mobileValid: true,
            mobiles: mobiles.map((m: number) => ({ key: m, value: m })),
          },
        });
      }
    },
    *mobileLoginIn({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          loading: true,
        },
      });

      const response = yield call(queryPost, payload, '/sys/doLoginMobile');
      const { code, body } = response;
      yield put({
        type: 'save',
        payload: {
          statusCode: code,
        },
      });
      yield put({
        type: 'changeStatus',
        payload: {
          loading: false,
        },
      });

      if (code === 200) {
        const { token } = body;
        localStorage.setItem('token', token);

        yield call(delay, 300);
        yield put(routerRedux.replace('/'));
      }
    },

    *getImageCaptcha(_, { call, put }) {
      const response = yield call(query, '/sys/login');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          const { key, image } = body;
          yield put({
            type: 'save',
            payload: {
              image,
              key,
            },
          });
        }
      }
    },
    *getCaptcha({ payload }, { call }) {
      const response = yield call(queryPost, payload, '/sys/getCaptcha');
      if (response) {
        const { code } = response;
        if (code === 200) {
          message.success('短信发送成功');
        }
      }
    },
    *logout(_, { call, put }) {
      if (window.location.pathname !== '/user/login') {
        yield call(query, '/sys/logout');
        localStorage.removeItem('token');
        yield put({
          type: 'changeLoginStatus',
          payload: {
            statusCode: 200,
            loading: false,
            isRefreshCode: false,
            mobileValid: false,
          },
        });
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
