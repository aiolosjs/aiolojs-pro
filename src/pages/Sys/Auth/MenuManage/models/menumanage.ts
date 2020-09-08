import { message } from 'antd';
import { Reducer, Effect } from 'umi';
import { create, update, remove, query } from '@/services/api';

function formatter(data: MenuManageTableDataProps[] = [], dna: string) {
  return data.map((item) => {
    const { id, parentId } = item;

    const result = {
      ...item,
      key: id,
      groupDna: parentId === 0 ? '0' : `${dna}-${parentId}`,
    };
    if (item.children && item.children.length !== 0) {
      result.children = formatter(item.children, result.groupDna);
    } else {
      delete result.children;
    }
    return result;
  });
}

export interface MenuManageTableDataProps {
  id: number;
  parentId?: number;
  groupDna?: string;
  name?: string;
  menuType?: number;
  menuOrder?: number;
  permission?: string;
  icon?: string;
  path?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  isActive?: number;
  isDeleted?: number;
  remark?: string;
  children?: MenuManageTableDataProps[];
}

export interface MenuManageState {
  tableData: MenuManageTableDataProps[];
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface AccountManageModelType {
  namespace: 'menumanage';
  state: MenuManageState;
  effects: {
    fetch: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    modalVisible: Reducer<MenuManageState>;
    changgeConfirmLoading: Reducer<MenuManageState>;
    save: Reducer<MenuManageState>;
  };
}

const accountManageModelType: AccountManageModelType = {
  namespace: 'menumanage',
  state: {
    tableData: [],
    modalVisible: false,
    confirmLoading: false,
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query, {}, '/sys/menu/tree');
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
      const response = yield call(update, payload, '/sys/menu/update');
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

    *create({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(create, payload, '/sys/menu/save');
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
      const response = yield call(remove, payload, '/sys/menu/delete');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              tableData: body,
            },
          });
          message.success('删除成功');
        }
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
        tableData: formatter(tableData, '0'),
        ...rest,
      };
    },
  },
};

export default accountManageModelType;
