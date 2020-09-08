import React from 'react';
import { Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RenderFormItemProps } from '@/core/common/renderFormItem';
import { IconMap } from '@/utils/constant';

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
            const Icon = React.cloneElement(IconMap[text], {
              style: {
                fontSize: 16,
                color: '#08c',
              },
            });

            return Icon;
          }
          return null;
        },
      },
    ],
  };
}

export default pageConfig;
