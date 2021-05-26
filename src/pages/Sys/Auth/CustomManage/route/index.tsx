import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Input, Card, Modal, Popconfirm, Row, Col, Popover, Descriptions } from 'antd';
import uniq from 'lodash/uniq';
import Highlighter from 'react-highlight-words';
import type { ColumnProps } from 'antd/lib/table';
import AuthBlock from '@/components/AuthBlock';
import { useSelector, useDispatch } from 'umi';
import { useQueryFormParams } from '@/utils/hooks';
import TableList from '@/components/TableList';
import type { DvaLoadingState } from '@/utils/types';
import { formaterObjectValue, formItemAddInitValue } from '@/utils/utils';
import type { RenderFormItemProps } from '@/core/common/renderFormItem';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import type { CustomManageTableDataProps, CustomManageState } from '../models/custommanage';
import type { ModelRef } from './ModalDetailForm';
import DetailFormInfo from './ModalDetailForm';
import type { OperatorKeys, OperatorType } from './interface';

import pageConfig from './pageConfig';

function getFlatArray(data: CustomManageTableDataProps[]): CustomManageTableDataProps[] {
  return data.reduce((keys: CustomManageTableDataProps[], item: CustomManageTableDataProps) => {
    const { id, groupName, parentId, groupDna } = item;
    keys.push({ id, groupName, parentId, groupDna });
    const child = item.children;
    if (child) {
      return keys.concat(getFlatArray(child));
    }
    return keys;
  }, []);
}

function getParentDna(key: number, list: CustomManageTableDataProps[]) {
  const curItem = list.find((item) => item.id === key);
  if (curItem) {
    const { groupDna = '', id } = curItem;
    return groupDna
      .split('-')
      .map((dna) => parseInt(dna, 10))
      .filter((dna) => dna !== id);
  }
  return [];
}

interface IRootState {
  custommanage: CustomManageState;
  loading: DvaLoadingState;
}

const operatorTypeDic: OperatorType = {
  create: '新建客户',
  update: '修改客户',
};

export default (): React.ReactNode => {
  const dispatch = useDispatch();
  const { custommanage, loading } = useSelector((state: IRootState) => state);
  const { modalVisible, confirmLoading, tableData = [] } = custommanage;

  const [payload, { setFormAdd, setFormUpdate }] = useQueryFormParams();
  const modelReduceType = useRef<OperatorKeys>('fetch');
  const detailFormRef = useRef<ModelRef | null>(null);

  const { detailFormItems = [] } = pageConfig<CustomManageTableDataProps>();

  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [currentItem, setCurrentItem] = useState<CustomManageTableDataProps | {}>({});
  const [modalType, setModalType] = useState<OperatorKeys>();
  const [formItems, setFormItems] = useState<RenderFormItemProps[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const memoData = useMemo(() => getFlatArray(tableData), [tableData]);

  useEffect(() => {
    dispatch({
      type: `custommanage/${modelReduceType.current}`,
      payload,
    });
  }, [payload]);

  useEffect(() => {
    if (tableData.length > 0) {
      const parentNode = tableData[0];
      setExpandedRowKeys([parentNode.id]);
    }
  }, [tableData]);

  const updateFormItems = (record = {}) => {
    const newFormItems = formItemAddInitValue([...detailFormItems], record);
    setFormItems([...newFormItems]);
  };

  const changeModalVisibel = (flag: boolean) => {
    dispatch({
      type: 'custommanage/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const showModalVisibel = (type: OperatorKeys, record: CustomManageTableDataProps | {}) => {
    updateFormItems(record);
    setModalTitle(operatorTypeDic[type]);
    changeModalVisibel(true);
    setModalType(type);
    setCurrentItem(record);
  };

  const hideModalVisibel = () => {
    changeModalVisibel(false);
    setCurrentItem({});
  };

  const deleteTableRowHandle = (id: number) => {
    modelReduceType.current = 'remove';
    setFormUpdate({ id });
  };

  const modalOkHandle = async () => {
    const fieldsValue = await detailFormRef.current?.form?.validateFields();
    const fields = formaterObjectValue(fieldsValue);
    if (modalType === 'create') {
      modelReduceType.current = 'create';
      setFormAdd(fields);
    } else if (modalType === 'update') {
      modelReduceType.current = 'update';
      setFormUpdate(fields);
    }
  };

  const renderSearchForm = () => {
    function onSearch(value: string) {
      const expandedKeys: number[] = [];
      memoData.forEach((item) => {
        if (item.groupName && item.groupName.indexOf(value.trim()) > -1) {
          expandedKeys.push(...getParentDna(item.id, memoData));
        }
      });
      setExpandedRowKeys((preExpandedRowKeys) => [...preExpandedRowKeys, ...expandedKeys]);
      setSearchText(value.trim());
    }

    return (
      <Input.Search
        enterButton="搜索"
        onSearch={onSearch}
        style={{ width: 350 }}
        placeholder="请输入客户名称"
      />
    );
  };

  const extraTableColumnRender = () => {
    return [
      {
        title: '操作',
        width: 120,
        render(_: any, record: CustomManageTableDataProps) {
          const { id, groupName, parentId, parentName, linkman, mobile, remark, isActive } = record;
          if (isActive) {
            const DetailInfo = (
              <Descriptions column={1} style={{ width: 400 }}>
                <Descriptions.Item label="客户名称">{groupName}</Descriptions.Item>
                <Descriptions.Item label="上级客户名称">{parentName}</Descriptions.Item>
                <Descriptions.Item label="联系人">{linkman}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{mobile}</Descriptions.Item>
                <Descriptions.Item label="备注">{remark}</Descriptions.Item>
              </Descriptions>
            );
            // parentId = 0
            return (
              <div>
                {parentId === 0 ? (
                  <Row>
                    <AuthBlock authority="sys:group:save">
                      <Col span={6}>
                        <a
                          onClick={() => {
                            showModalVisibel('create', {
                              parentName: groupName,
                              parentId: id,
                            });
                          }}
                        >
                          <UserAddOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }} />
                        </a>
                      </Col>
                    </AuthBlock>
                  </Row>
                ) : (
                  <Row>
                    <AuthBlock authority="sys:group:save">
                      <Col span={6}>
                        <a
                          onClick={() => {
                            showModalVisibel('create', {
                              parentName: groupName,
                              parentId: id,
                            });
                          }}
                        >
                          <UserAddOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }} />
                        </a>
                      </Col>
                    </AuthBlock>
                    <AuthBlock authority="sys:group:show">
                      <Col span={6}>
                        <Popover
                          title="查看详情"
                          placement="topRight"
                          content={DetailInfo}
                          trigger="click"
                        >
                          <a>
                            <SearchOutlined
                              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}
                            />
                          </a>
                        </Popover>
                      </Col>
                    </AuthBlock>
                    <AuthBlock authority="sys:group:update">
                      <Col span={6}>
                        <a
                          onClick={() => {
                            showModalVisibel('update', record);
                          }}
                        >
                          <EditOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }} />
                        </a>
                      </Col>
                    </AuthBlock>
                    <AuthBlock authority="sys:group:delete">
                      <Col span={6}>
                        <Popconfirm
                          title="确定删除吗？"
                          placement="topRight"
                          onConfirm={() => {
                            deleteTableRowHandle(record.id);
                          }}
                        >
                          <a>
                            <DeleteOutlined
                              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}
                            />
                          </a>
                        </Popconfirm>
                      </Col>
                    </AuthBlock>
                  </Row>
                )}
              </div>
            );
          }
          return null;
        },
      },
    ];
  };

  const renderTableList = () => {
    const tableLoading = loading.models.custommanage;
    const tableColumns: ColumnProps<CustomManageTableDataProps>[] = [
      {
        title: '组织架构',
        dataIndex: 'groupName',
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
      },
    ];
    const newTableColumns = [...tableColumns, ...extraTableColumnRender()];

    function onExpand(expanded: boolean, record: CustomManageTableDataProps) {
      if (expanded) {
        setExpandedRowKeys((preExpandedRowKeys) => [...preExpandedRowKeys, record.id]);
      } else {
        setExpandedRowKeys((preExpandedRowKeys) => [
          ...preExpandedRowKeys.filter((id) => id !== record.id),
        ]);
      }
    }

    return (
      <TableList<CustomManageTableDataProps>
        size="middle"
        bordered={false}
        loading={tableLoading}
        columns={newTableColumns}
        dataSource={tableData}
        pagination={false}
        expandedRowKeys={uniq(expandedRowKeys)}
        onExpand={onExpand}
      />
    );
  };

  return (
    <PageHeaderWrapper title={false}>
      <Card bordered={false}>
        <div className="tableList">
          <div className="tableList-searchform">{renderSearchForm()}</div>
          {renderTableList()}
        </div>
      </Card>
      <Modal
        title={modalTitle}
        destroyOnClose
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={hideModalVisibel}
        onOk={modalOkHandle}
      >
        <DetailFormInfo
          ref={detailFormRef}
          formItems={formItems}
          currentItem={currentItem}
          modalType={modalType}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};
