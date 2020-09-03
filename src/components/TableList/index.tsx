import React from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';

class TableList<T extends object> extends React.PureComponent<TableProps<T>> {
  render() {
    return <Table<T> rowKey="id" {...this.props} />;
  }
}

export default TableList;
