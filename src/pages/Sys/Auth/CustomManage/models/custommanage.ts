import { message } from 'antd';
import { Reducer, Effect } from 'umi';
import { create, update, remove, query } from '@/services/api';

function formatter(data: CustomManageTableDataProps[] = []) {
  return data.map((item) => {
    const { id } = item;
    const result = {
      ...item,
      key: id,
    };
    if (item.children && item.children.length !== 0) {
      result.children = formatter(item.children);
    } else {
      delete result.children;
    }
    return result;
  });
}

export interface CustomManageTableDataProps {
  id: number;
  groupName?: string;
  parentId?: number;
  groupDna?: string;
  level?: number;
  linkman?: string;
  mobile?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  isActive?: number;
  isDeleted?: number;
  remark?: string;
  children?: CustomManageTableDataProps[];
  parentName?: string;
}

export interface CustomManageState {
  tableData: CustomManageTableDataProps[];
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface AccountManageModelType {
  namespace: 'custommanage';
  state: CustomManageState;
  effects: {
    fetch: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    modalVisible: Reducer<CustomManageState>;
    changgeConfirmLoading: Reducer<CustomManageState>;
    save: Reducer<CustomManageState>;
  };
}

const accountManageModelType: AccountManageModelType = {
  namespace: 'custommanage',
  state: {
    tableData: [],
    modalVisible: false,
    confirmLoading: false,
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query, '/sys/group/tree');
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
      const response = yield call(update, payload, '/sys/group/update');
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
      const response = yield call(create, payload, '/sys/group/save');
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
      const response = yield call(remove, payload, '/sys/group/delete');
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
      const { tableData, ...rest } = payload;
      return {
        ...state,
        tableData: formatter(tableData),
        ...rest,
      };
    },
  },
};

export default accountManageModelType;
