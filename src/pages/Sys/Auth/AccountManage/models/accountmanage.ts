import { message } from 'antd';
import { Reducer, Effect } from 'umi';
import { create, update, remove, queryPost } from '@/services/api';
import { ITableData } from '@/utils/types';

export interface AccountManageTableDataProps {
  id?: number;
  username?: string;
  nickname?: string;
  mobile?: string;
  roleId?: number;
  roleName?: string;
  sysGroupId?: number;
  sysGroupName?: string;
  isActive?: number;
  groupAuthorizedIds?: string[];
  autoAuthorized?: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AccountManageState {
  tableData: ITableData<AccountManageTableDataProps>;
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface AccountManageModelType {
  namespace: 'accountmanage';
  state: AccountManageState;
  effects: {
    fetch: Effect;
    create: Effect;
    update: Effect;
    updatePassword: Effect;
    changeStatus: Effect;
    remove: Effect;
  };
  reducers: {
    modalVisible: Reducer<AccountManageState>;
    changgeConfirmLoading: Reducer<AccountManageState>;
    save: Reducer<AccountManageState>;
    clear: Reducer<AccountManageState>;
  };
}

const accountManageModelType: AccountManageModelType = {
  namespace: 'accountmanage',
  state: {
    tableData: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    confirmLoading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPost, payload, '/sys/user/list');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
        }
      }
    },
    *update({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(update, payload, '/sys/user/update');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
          message.success('修改成功');
        }
      }
    },
    *updatePassword({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(update, payload, '/sys/user/resetPassword');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
          message.success('密码修改成功');
        }
      }
    },
    *changeStatus({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(update, payload, '/sys/user/status');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
          message.success('状态修改成功');
        }
      }
    },
    *create({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(create, payload, '/sys/user/save');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
          message.success('添加成功');
        }
      }
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload, '/sys/role/delete');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
        }
        message.success('删除成功');
      }
    },
  },
  reducers: {
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
    save(state, { payload }) {
      const { tableData } = payload as Pick<AccountManageState, 'tableData'>;
      return {
        ...state,
        tableData: {
          ...tableData,
        },
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default accountManageModelType;
