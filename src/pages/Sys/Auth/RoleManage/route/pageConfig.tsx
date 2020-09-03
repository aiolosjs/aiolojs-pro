import { ColumnProps } from 'antd/lib/table';
import { TreeNode } from 'antd/lib/tree-select';
import { FormComponentProps } from 'antd/lib/form/Form';
import { RenderFormItemProps } from '@/core/common/renderFormItem';

const formItemProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

function formatter(node: any[] = []): TreeNode[] {
  return node.map(item => {
    const { key, value } = item;

    const result = {
      ...item,
      key,
      value: key,
      title: value,
    };
    const child = item.children;
    if (child) {
      const children = formatter(child);
      result.children = children;
    }
    return result;
  });
}

export interface PageConfigProps<T> {
  name: string;
  path: string;
  tableColumns?: ColumnProps<T>[];
  searchForms?: RenderFormItemProps[];
  detailFormItems?: RenderFormItemProps[];
}

interface IContext {
  current?: FormComponentProps;
}

function pageConfig<T>(context?: IContext): PageConfigProps<T> {
  return {
    name: '角色管理',
    path: 'permission/rolemanage',
    tableColumns: [
      {
        title: '角色ID',
        dataIndex: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
      },
      {
        title: '操作人',
        dataIndex: 'updatedBy',
      },
    ],
    searchForms: [

      {
        widget: 'AInput',
        name: 'roleName',
        label: '角色名称',
        formItemProps,
        widgetProps: {
        },
      },
    ],
    detailFormItems: [
      {
        widget: 'AInput',
        name: 'id',
        colSpan: 0,
      },
      {
        widget: 'AInput',
        name: 'roleName',
        label: '角色名称',
        required: true,
        colSpan: 24,
        formItemProps,
      },
      {
        widget: 'ADynamicTree',
        name: 'menuList',
        label: '菜单权限',
        required: true,
        colSpan: 24,
        formItemProps,
        formatter,
        action: "/sys/menu/dic",
        treeCheckParentStrictly: true,
        widgetProps: {
          defaultExpandAll: true,
          checkable: true,
          checkStrictly: true,
          selectable: false,
          getPopupContainer: () => document.querySelector('.ant-modal-wrap '),
        },
      },
      {
        widget: 'AInputTextArea',
        name: 'remark',
        label: '备注',
        required: false,
        colSpan: 24,
        formItemProps,
        widgetProps:{
          autoSize: { minRows: 5, maxRows: 10 },
        }
      },
    ],
  };
}

export default pageConfig;
