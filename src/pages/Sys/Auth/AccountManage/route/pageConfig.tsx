import React from 'react';
import { Tag } from 'antd';
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

function formatter(node: any[] = []): any[] {
  return node.map((item) => {
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

function pageConfig<T>(): PageConfigProps<T> {
  return {
    name: '账号管理',
    path: 'permission/accountmanage',
    tableColumns: [
      {
        title: '序号',
        dataIndex: 'order',
        render(_text, _record, index) {
          return index + 1;
        },
      },
      {
        title: '登录账号',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
      },
      {
        title: '所属客户',
        dataIndex: 'sysGroupName',
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
      {
        title: '状态',
        dataIndex: 'isActive',
        width: 60,
        render(text) {
          if (text === 0) {
            return <Tag color="#f5222d">已停用</Tag>;
          }
          return <Tag color="#52c41a">已启用</Tag>;
        },
      },
    ],
    searchForms: [
      {
        widget: 'ADynamicTreeSelect',
        name: 'sysGroupId',
        label: '所属客户',
        initialValue: null,
        action: '/sys/group/dic',
        treeCheckParentStrictly: true,
        formItemProps,
        formatter,
        widgetProps: {
          treeCheckable: true,
          treeCheckStrictly: true,
          maxTagCount: 2,
          maxTagPlaceholder: () => <div>...</div>,
          dropdownStyle: {
            maxHeight: 360,
          },
          id: 'sysGroupId_s',
          allowClear: true,
        },
      },

      {
        widget: 'ASelect',
        name: 'isActive',
        label: '状态',
        formItemProps,
        selectOptions: [
          {
            key: 1,
            value: '已启用',
          },
          {
            key: 0,
            value: '已停用',
          },
        ],
      },
      {
        widget: 'ADynamicSelect',
        name: 'roleId',
        label: '角色',
        action: '/sys/role/dic',
        formItemProps,
        widgetProps: {
          id: 'roleId_',
          allowClear: true,
        },
      },
      {
        widget: 'AInput',
        name: 'keyword',
        label: '查询条件',
        formItemProps,
        widgetProps: {
          placeholder: '请输入账号/姓名/手机号',
          allowClear: true,
        },
      },
    ],
  };
}

export default pageConfig;
