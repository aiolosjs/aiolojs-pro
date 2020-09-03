import { ColumnProps } from 'antd/lib/table';
import { RenderFormItemProps } from '@/core/common/renderFormItem';

const formItemProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

export interface PageConfigProps<T> {
  name: string;
  path: string;
  tableColumns?: ColumnProps<T>[];
  searchForms?: RenderFormItemProps[];
  detailFormItems?: RenderFormItemProps[];
}

function pageConfig<T>(): PageConfigProps<T> {
  return {
    name: '客户管理',
    path: 'permission/custommanage',

    detailFormItems: [
      {
        widget: 'AInput',
        name: 'id',
        colSpan: 0,
        initialValue: -1,
      },
      {
        widget: 'AInput',
        name: 'parentId',
        colSpan: 0,
        initialValue: -1,
      },
      {
        widget: 'AInput',
        name: 'groupName',
        label: '客户名称',
        required: true,
        colSpan: 24,
        formItemProps,
      },
      {
        widget: 'AInput',
        name: 'parentName',
        label: '上级客户名称',
        required: true,
        colSpan: 24,
        formItemProps,
        widgetProps: {
          disabled: true,
        },
      },
      {
        widget: 'AInput',
        name: 'linkman',
        label: '联系人',
        required: true,
        colSpan: 24,
        formItemProps,
      },
      {
        widget: 'AInputPhone',
        name: 'mobile',
        label: '联系电话',
        required: true,
        colSpan: 24,
        formItemProps,
      },
      {
        widget: 'AInputTextArea',
        name: 'remark',
        label: '备注',
        required: false,
        colSpan: 24,
        formItemProps,
        widgetProps: {
          autoSize: { minRows: 5, maxRows: 10 },
        },
      },
    ],
  };
}

export default pageConfig;
