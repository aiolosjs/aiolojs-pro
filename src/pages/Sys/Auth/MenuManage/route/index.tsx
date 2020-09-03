import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Input, Card, Modal, Popconfirm, Row, Col } from 'antd';
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import uniq from 'lodash/uniq';
import Highlighter from 'react-highlight-words';
import { ColumnProps } from 'antd/lib/table';
import AuthBlock from '@/components/AuthBlock';
import { useSelector, useDispatch } from 'umi';
import { useQueryFormParams } from '@/utils/hooks';
import TableList from '@/components/TableList';
import { DvaLoadingState } from '@/utils/types';
import { formaterObjectValue } from '@/utils/utils';
import {
  MenuManageTableDataProps,
  MenuManageState,
} from '@/pages/Sys/Auth/MenuManage/models/menumanage';
import DetailFormInfo, { ModelRef } from './ModalDetailForm';

import pageConfig from './pageConfig';

function getFlatArray(data: MenuManageTableDataProps[]): MenuManageTableDataProps[] {
  return data.reduce((keys: MenuManageTableDataProps[], item: MenuManageTableDataProps) => {
    const { id, name, parentId, groupDna } = item;
    keys.push({ id, name, parentId, groupDna });
    const child = item.children;
    if (child) {
      return keys.concat(getFlatArray(child));
    }
    return keys;
  }, []);
}

function getParentDna(key: number, list: MenuManageTableDataProps[]) {
  const currItem = list.find((item) => item.id === key);
  if (currItem) {
    const { groupDna = '', id } = currItem;
    return groupDna
      .split('-')
      .map((dna) => parseInt(dna, 10))
      .filter((dna) => dna !== id);
  }
  return [];
}

interface IRootState {
  menumanage: MenuManageState;
  loading: DvaLoadingState;
}

export type OperatorKeys = 'fetch' | 'create' | 'update' | 'remove';
export type OperatorType = { [K in OperatorKeys]?: string };
const operatorTypeDic: OperatorType = {
  create: '新建',
  update: '修改',
};

export default (): React.ReactNode => {
  const dispatch = useDispatch();
  const { menumanage, loading } = useSelector((state: IRootState) => state);
  const { modalVisible, confirmLoading, tableData = [] } = menumanage;

  const [payload, { setFormAdd, setFormUpdate }] = useQueryFormParams();
  const modelReduceType = useRef<OperatorKeys>('fetch');
  const detailFormRef = useRef<ModelRef | null>(null);

  const { tableColumns = [] } = pageConfig<MenuManageTableDataProps>();

  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [currentItem, setCurrentItem] = useState<MenuManageTableDataProps | {}>({});
  const [modalType, setModalType] = useState<OperatorKeys>('create');
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const memoData = useMemo(() => getFlatArray(tableData), [tableData]);

  useEffect(() => {
    dispatch({
      type: `menumanage/${modelReduceType.current}`,
      payload,
    });
  }, [payload]);

  useEffect(() => {
    if (tableData.length > 0) {
      const parentNode = tableData[0];
      setExpandedRowKeys([parentNode.id]);
    }
  }, [tableData]);

  const changeModalVisibel = (flag: boolean) => {
    dispatch({
      type: 'menumanage/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const showModalVisibel = (type: OperatorKeys, record: Partial<MenuManageTableDataProps>) => {
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
        const { id = -1, name } = item;
        if (name && name.indexOf(value.trim()) > -1) {
          expandedKeys.push(...getParentDna(id, memoData));
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
        placeholder="请输入目录、菜单或按钮名称"
      />
    );
  };

  const extraTableColumnRender = () => {
    return [
      {
        title: '操作',
        width: 120,
        render(_: any, record: MenuManageTableDataProps) {
          const { id = -1, parentId, isActive, menuType } = record;
          if (isActive) {
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
                              parentId: id,
                              menuType,
                            });
                          }}
                        >
                          <FolderAddOutlined
                            style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}
                          />
                        </a>
                      </Col>
                    </AuthBlock>
                  </Row>
                ) : (
                  <Row>
                    {menuType !== 3 && (
                      <AuthBlock authority="sys:group:save">
                        <Col span={6}>
                          <a
                            onClick={() => {
                              showModalVisibel('create', {
                                // parentName: name,
                                parentId: id,
                                menuType: menuType === 2 ? 3 : 1,
                              });
                            }}
                          >
                            <FolderAddOutlined
                              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}
                            />
                          </a>
                        </Col>
                      </AuthBlock>
                    )}

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
                            deleteTableRowHandle(id);
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
    const tableLoading = loading.models.menumanage;

    const menuNameColumn: ColumnProps<MenuManageTableDataProps> = {
      title: '菜单名称',
      dataIndex: 'name',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ),
    };
    const newTableColumns = [menuNameColumn, ...tableColumns, ...extraTableColumnRender()];

    function onExpand(expanded: boolean, record: MenuManageTableDataProps) {
      const { id = -1 } = record;
      if (expanded) {
        setExpandedRowKeys((preExpandedRowKeys) => [...preExpandedRowKeys, id]);
      } else {
        setExpandedRowKeys((preExpandedRowKeys) => [...preExpandedRowKeys.filter((i) => i !== id)]);
      }
    }

    return (
      <TableList<MenuManageTableDataProps>
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
        <DetailFormInfo ref={detailFormRef} currentItem={currentItem} modalType={modalType} />
      </Modal>
    </PageHeaderWrapper>
  );
};
