import { message } from 'antd';
import { Reducer, Effect } from 'umi';
import { create, update, remove, queryPost } from '@/services/api';
import { ITableData } from '@/utils/types';

export interface RoleManageTableDataProps {
  id: number;
  roleName?: string;
  sysGroupId?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  isActive?: number;
  isDeleted?: number;
  remark?: string;
  menuList?: number[];
}

export interface RoleManageState {
  tableData: ITableData<RoleManageTableDataProps>;
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface AccountManageModelType {
  namespace: 'rolemanage';
  state: RoleManageState;
  effects: {
    fetch: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    modalVisible: Reducer<RoleManageState>;
    changgeConfirmLoading: Reducer<RoleManageState>;
    save: Reducer<RoleManageState>;
  };
}

const accountManageModelType: AccountManageModelType = {
  namespace: 'rolemanage',
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
      const response = yield call(queryPost, payload, '/sys/role/list');
      if (response) {
        const { code = 200, body } = response;
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
      const response = yield call(update, payload, '/sys/role/update');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code = 200, body } = response;
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
        }
        message.success('修改成功');
      }
    },

    *create({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(create, payload, '/sys/role/save');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code = 200, body } = response;
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
        }
        message.success('添加成功');
      }
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload, '/sys/role/delete');
      if (response) {
        const { code = 200, body } = response;
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
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default accountManageModelType;
