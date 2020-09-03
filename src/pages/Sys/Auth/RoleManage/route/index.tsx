import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Modal, Popconfirm, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import AuthBlock from '@/components/AuthBlock';
import { useSelector, useDispatch } from 'umi';
import { useQueryFormParams } from '@/utils/hooks';
import SearchForms from '@/components/SearchForm';
import TableList from '@/components/TableList';
import { DvaLoadingState } from '@/utils/types';
import { formaterObjectValue, formItemAddInitValue } from '@/utils/utils';
import { RenderFormItemProps } from '@/core/common/renderFormItem';
import {
  RoleManageTableDataProps,
  RoleManageState,
} from '@/pages/Sys/Auth/RoleManage/models/rolemanage';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DetailFormInfo, { ModelRef } from './ModalDetailForm';

import { OperatorKeys, OperatorType } from './interface';

import pageConfig from './pageConfig';

interface IRootState {
  rolemanage: RoleManageState;
  loading: DvaLoadingState;
}

const operatorTypeDic: OperatorType = {
  create: '新建账号',
  update: '修改账号',
};

export default (): React.ReactNode => {
  const dispatch = useDispatch();
  const { rolemanage, loading } = useSelector((state: IRootState) => state);
  const { modalVisible, confirmLoading } = rolemanage;

  const [payload, { setQuery, setPagination, setFormAdd, setFormUpdate }] = useQueryFormParams();
  const modelReduceType = useRef<OperatorKeys>('fetch');
  const detailFormRef = useRef<ModelRef | null>(null);

  const { searchForms = [], tableColumns = [], detailFormItems = [] } = pageConfig<
    RoleManageTableDataProps
  >(detailFormRef);

  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [, setCurrentItem] = useState<RoleManageTableDataProps | {}>({});
  const [modalType, setModalType] = useState<OperatorKeys>();
  const [formItems, setFormItems] = useState<RenderFormItemProps[]>([]);

  useEffect(() => {
    dispatch({
      type: `rolemanage/${modelReduceType.current}`,
      payload,
    });
  }, [payload]);

  const updateFormItems = (record = {}) => {
    const newFormItems = formItemAddInitValue([...detailFormItems], record);
    setFormItems([...newFormItems]);
  };

  const changeModalVisibel = (flag: boolean) => {
    dispatch({
      type: 'rolemanage/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const showModalVisibel = (type: OperatorKeys, record: RoleManageTableDataProps | {}) => {
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
    function onSubmit(queryValues: any) {
      modelReduceType.current = 'fetch';
      const query = formaterObjectValue(queryValues);
      setQuery(query);
    }

    function onReset() {
      modelReduceType.current = 'fetch';
      setQuery({});
    }

    return <SearchForms formItems={searchForms} onSubmit={onSubmit} onReset={onReset} />;
  };

  const extraTableColumnRender = () => {
    return [
      {
        title: '操作',
        width: 90,
        dataIndex: 'actions',
        render: (_: any, record: RoleManageTableDataProps) => {
          return (
            <div>
              <Row>
                <AuthBlock authority="sys:role:update">
                  <Col span={12}>
                    <a
                      onClick={() => {
                        showModalVisibel('update', record);
                      }}
                    >
                      <EditOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }} />
                    </a>
                  </Col>
                </AuthBlock>
                <AuthBlock authority="sys:role:delete">
                  <Col span={12}>
                    <Popconfirm
                      title="确定删除吗？"
                      placement="topRight"
                      onConfirm={() => {
                        deleteTableRowHandle(record.id);
                      }}
                    >
                      <a>
                        <DeleteOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }} />
                      </a>
                    </Popconfirm>
                  </Col>
                </AuthBlock>
              </Row>
            </div>
          );
        },
      },
    ];
  };

  const renderTableList = () => {
    const tableLoading = loading.models.rolemanage;
    const {
      tableData: { list, pagination },
    } = rolemanage;
    const newTableColumns = [...tableColumns, ...extraTableColumnRender()];

    function onChange(current: number, pageSize?: number) {
      modelReduceType.current = 'fetch';
      setPagination({ current, pageSize });
    }

    return (
      <TableList<RoleManageTableDataProps>
        bordered={false}
        loading={tableLoading}
        columns={newTableColumns}
        dataSource={list}
        pagination={{ pageSize: 10, onChange, ...pagination }}
      />
    );
  };

  return (
    <PageHeaderWrapper title={false}>
      <Card bordered={false}>
        <div className="tableList">
          <div className="tableList-searchform">{renderSearchForm()}</div>
          <div className="tableList-operator">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => showModalVisibel('create', {})}
            >
              新建账号
            </Button>
          </div>
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
        <DetailFormInfo ref={detailFormRef} formItems={formItems} />
      </Modal>
    </PageHeaderWrapper>
  );
};
