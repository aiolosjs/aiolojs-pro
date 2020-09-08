import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import { queryCurrent, query as queryUsers } from '@/services/user';
import { update } from '@/services/api';

export interface CurrentUser {
  user?: {
    autoAuthorized?: number;
    avatar?: any;
    createdAt?: string;
    createdBy?: string;
    email?: any;
    id?: number;
    isActive?: number;
    isDeleted?: number;
    level?: number;
    mobile?: string;
    nickname?: string;
    password?: any;
    remark?: any;
    roleId?: number;
    sysGroupId?: number;
    updatedAt?: string;
    updatedBy?: any;
    username?: string;
    uuId?: string;
  };
  nav?: UserNavMenu[];
  btn?: IBtn[];
}

export interface IBtn {
  id?: number;
  parentId?: number;
  menuName?: string;
  menuType?: number;
  menuOrder?: number;
  permission?: string;
  icon?: any;
  path?: any;
  children?: any;
}

export interface UserNavMenu {
  id: number;
  parentId: number;
  menuType: number;
  name: string;
  path: string;
  menuOrder?: number;
  permission?: string;
  icon?: string;
  children?: UserNavMenu[];
  routes?: UserNavMenu[];
}

export interface UserModelState {
  currentUser: CurrentUser;
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    updatePassword: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    modalVisible: Reducer<UserModelState>;
    changgeConfirmLoading: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.body,
      });
    },
    *updatePassword({ payload }, { call, put }) {
      const response = yield call(update, payload, '/sys/modify/password');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      if (response) {
        const { code } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          message.success('密码修改成功');
        }
      }
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { btn = [] } = action.payload;
      return {
        ...state,

        currentUser: {
          btnAuth: btn,
          ...action.payload,
        },
      };
    },
    modalVisible(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changgeConfirmLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default UserModel;
