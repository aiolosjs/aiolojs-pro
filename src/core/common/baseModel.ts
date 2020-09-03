import { Reducer } from 'umi';

export interface ITableData {
  list?: [];
  pagination?: IPagination;
}

export interface IPagination {
  total?: number;
  current?: number;
  pageSize?: number;
  pageTotal?: number;
}

export interface BaseModelState {
  tableData?: ITableData;
  modalVisible?: boolean;
  confirmLoading?: boolean;
}

export interface BaseModelType {
  state: BaseModelState;
  reducers: {
    modalVisible: Reducer<BaseModelState>;
    changgeConfirmLoading: Reducer<BaseModelState>;
    save: Reducer<BaseModelState>;
    clear: Reducer<BaseModelState>;
  };
}

const baseModel: BaseModelType = {
  state: {
    tableData: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    confirmLoading: false,
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
    clear(state) {
      return {
        ...state,
        modalVisible: false,
        confirmLoading: false,
      };
    },
  },
};

export default baseModel;
