import { message } from 'antd';
import { Reducer, Effect } from 'umi';
import { query, create, update, remove, queryPost } from '@/services/api';
import { ITableData } from '@/utils/types';
import { delay } from '@/utils/utils';

export interface StandardTableDataProps {
  id: number;
  name: string;
  sex: string;
  remark: string;
}

export interface StandardTableState {
  tableData: ITableData<StandardTableDataProps>;
  modalVisible?: boolean;
  confirmLoading?: boolean;
  detailInfo: Partial<StandardTableDataProps>;
}

export interface StandardTableModelType {
  namespace: 'standardtable';
  state: StandardTableState;
  effects: {
    fetch: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    fetchDetailInfo: Effect;
  };
  reducers: {
    modalVisible: Reducer<StandardTableState>;
    changgeConfirmLoading: Reducer<StandardTableState>;
    save: Reducer<StandardTableState>;
    clear: Reducer<StandardTableState>;
  };
}

const standardTableModelType: StandardTableModelType = {
  namespace: 'standardtable',
  state: {
    tableData: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    confirmLoading: false,
    detailInfo: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPost, payload, '/sys/standardtable/list');
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
      yield call(delay);
      const response = yield call(update, payload, '/sys/standardtable/update');
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
      yield call(delay);
      const response = yield call(create, payload, '/sys/standardtable/add');
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
      const response = yield call(remove, payload, '/sys/standardtable/delete');
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
    *fetchDetailInfo({ payload }, { call, put }) {
      const response = yield call(query, payload, '/sys/standardtable/detail');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              detailInfo: body,
            },
          });
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
      return {
        ...state,
        ...payload,
      };
    },
    // @ts-ignore
    clear(state) {
      return {
        ...state,
        modalVisible: false,
        confirmLoading: false,
      };
    },
  },
};

export default standardTableModelType;
