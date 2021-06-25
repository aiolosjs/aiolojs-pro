import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Modal, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AuthBlock from '@/components/AuthBlock';
import { useQueryFormParams } from '@/utils/hooks';
import SearchForms from '@/components/SearchForm';
import TableList from '@/components/TableList';
import type { DvaLoadingState } from '@/utils/types';
import { formaterObjectValue } from '@/utils/utils';
import type { AccountManageTableDataProps, AccountManageState } from '../models/accountmanage';
import type { ModelRef } from './ModalDetailForm';
import DetailFormInfo from './ModalDetailForm';
import type { OperatorKeys, OperatorType } from './interface';

import pageConfig from './pageConfig';

interface IRootState {
  accountmanage: AccountManageState;
  loading: DvaLoadingState;
}

const operatorTypeDic: OperatorType = {
  create: '新建账号',
  update: '修改账号',
  updatePassword: '修改密码',
};

export default (): React.ReactNode => {
  const dispatch = useDispatch();
  const { accountmanage, loading } = useSelector((state: IRootState) => state);
  const { modalVisible, confirmLoading } = accountmanage;

  const [payload, { setQuery, setPagination, setFormAdd, setFormUpdate }] = useQueryFormParams();
  const modelReduceType = useRef<OperatorKeys>('fetch');
  const detailFormRef = useRef<ModelRef | null>(null);

  const { searchForms = [], tableColumns = [] } = pageConfig<AccountManageTableDataProps>();

  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [currentItem, setCurrentItem] = useState<AccountManageTableDataProps | {}>({});
  const [modalType, setModalType] = useState<OperatorKeys>('create');

  useEffect(() => {
    dispatch({
      type: `accountmanage/${modelReduceType.current}`,
      payload,
    });
  }, [payload]);

  const changeModalVisibel = (flag: boolean) => {
    dispatch({
      type: 'accountmanage/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const showModalVisibel = (type: OperatorKeys, record: AccountManageTableDataProps | {}) => {
    setModalType(type);
    setModalTitle(operatorTypeDic[type]);
    changeModalVisibel(true);
    setCurrentItem(record);
  };

  const hideModalVisibel = () => {
    changeModalVisibel(false);
    setCurrentItem({});
  };

  const changeStatusHandle = (record: AccountManageTableDataProps) => {
    const { id, isActive } = record;
    modelReduceType.current = 'changeStatus';
    setFormUpdate({ id, isActive: isActive === 1 ? 0 : 1 });
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
    } else if (modalType === 'updatePassword') {
      modelReduceType.current = 'updatePassword';
      setFormUpdate(fields);
    } else {
      modelReduceType.current = 'changeStatus';
      setFormUpdate(fields);
    }
  };

  const renderSearchForm = () => {
    function onSubmit(queryValues: any) {
      modelReduceType.current = 'fetch';
      const { sysGroupId } = queryValues;
      const sysGroupIds = Array.isArray(sysGroupId) ? sysGroupId.map((group) => group.value) : null;
      Object.assign(queryValues, {
        sysGroupId: sysGroupIds,
      });

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
    const columns = [
      {
        title: '操作',
        width: 200,
        render: (_: any, record: AccountManageTableDataProps) => {
          const { isActive } = record;
          const statusText = isActive === 0 ? '启用' : '禁用';
          return (
            <div>
              <Row>
                <AuthBlock authority="sys:user:update">
                  <Col span={6}>
                    <a
                      onClick={() => {
                        showModalVisibel('update', record);
                      }}
                    >
                      编辑
                    </a>
                  </Col>
                </AuthBlock>
                <AuthBlock authority="sys:user:status">
                  <Col span={6}>
                    <Popconfirm
                      title={`确定${statusText}吗？`}
                      placement="topRight"
                      onConfirm={() => {
                        changeStatusHandle(record);
                      }}
                    >
                      <a>{statusText}</a>
                    </Popconfirm>
                  </Col>
                </AuthBlock>
                <AuthBlock authority="sys:user:resetPassword">
                  <Col span={9}>
                    <a
                      onClick={() => {
                        showModalVisibel('updatePassword', record);
                      }}
                    >
                      重置密码
                    </a>
                  </Col>
                </AuthBlock>
              </Row>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  const renderTableList = () => {
    const tableLoading = loading.models.accountmanage;
    const {
      tableData: { list, pagination },
    } = accountmanage;

    const newTableColumns = [...tableColumns, ...extraTableColumnRender()];

    function onChange(current: number, pageSize?: number) {
      modelReduceType.current = 'fetch';
      setPagination({ current, pageSize });
    }

    return (
      <TableList<AccountManageTableDataProps>
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
        width="55%"
        title={modalTitle}
        destroyOnClose
        forceRender
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={hideModalVisibel}
        onOk={modalOkHandle}
      >
        <DetailFormInfo ref={detailFormRef} modalType={modalType} currentItem={currentItem} />
      </Modal>
    </PageHeaderWrapper>
  );
};
