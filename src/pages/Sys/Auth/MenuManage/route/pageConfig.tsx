import React from 'react';
import { Tag } from 'antd';
import * as ALLICONS from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import { RenderFormItemProps } from '@/core/common/renderFormItem';

const camelize = (string: string) => {
  // eslint-disable-next-line no-useless-escape
  const str = string.replace(/[\-_\s]+(.)?/g, function match(_: any, chr: string) {
    return chr ? chr.toUpperCase() : '';
  });
  return str.substr(0, 1).toUpperCase() + str.substr(1);
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
    name: '菜单管理',
    path: 'permission/menumanage',
    tableColumns: [
      {
        title: '类型',
        dataIndex: 'menuType',
        render(text: number) {
          if (text === 1) {
            return <Tag color="#f50">目录</Tag>;
          }
          if (text === 2) {
            return <Tag color="#FAAD14">菜单</Tag>;
          }
          if (text === 3) {
            return <Tag color="#13C2C2">按钮</Tag>;
          }

          return text;
        },
      },
      {
        title: '菜单路径',
        dataIndex: 'path',
      },
      {
        title: '授权标识',
        dataIndex: 'permission',
        // render: text => (
        //   <Ellipsis length={100} tooltip>
        //     {text}
        //   </Ellipsis>
        // ),
      },
      {
        title: '排序',
        dataIndex: 'menuOrder',
      },
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        render: (text) => {
          if (text) {
            const Icon = ALLICONS[`${camelize(text)}Outlined`];
            return <Icon type={text} style={{ fontSize: 16, color: '#08c' }} />;
          }
          return null;
        },
      },
    ],
  };
}

export default pageConfig;
