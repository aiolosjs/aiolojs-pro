import React, { forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import { Form, Row, Col, Tag } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { AInput, ARadioGroup, ADynamicTree } from '@aiolosjs/components';
import AInputNumber from '@aiolosjs/components/lib/form/ainput/number';
import AInputTextArea from '@aiolosjs/components/lib/form/ainput/textarea';
import { asyncFn } from '@/utils/utils';
import { OperatorKeys } from '.';
import { MenuManageTableDataProps } from '../models/menumanage';

export type ModelRef = {
  form: FormInstance;
};

export interface ModalDetailFormProps {
  currentItem: Partial<MenuManageTableDataProps>;
  modalType: OperatorKeys;
}

const formItemProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

function formatter(node: any[] = [], menuTypeValue: number): TreeNodeNormal[] {
  return node.map((item) => {
    const { key, value, nodeType } = item;
    let tag;
    if (nodeType === 1) {
      tag = <Tag color="#f50">目录</Tag>;
    }
    if (nodeType === 2) {
      tag = <Tag color="#FAAD14">菜单</Tag>;
    }
    if (nodeType === 3) {
      tag = <Tag color="#13C2C2">按钮</Tag>;
    }

    let disabled = false;
    if (menuTypeValue === 1 || menuTypeValue === 2) {
      if (nodeType === 1) {
        disabled = false;
      } else {
        disabled = true;
      }
    } else if (nodeType === 1 || nodeType === 3) {
      disabled = true;
    } else {
      disabled = false;
    }

    const result = {
      ...item,
      key,
      value: key,
      disabled,
      title: (
        <>
          {tag} {value}
        </>
      ),
    };
    const child = item.children;
    if (child) {
      const children = formatter(child, menuTypeValue);
      result.children = children;
    }
    return result;
  });
}

const ModalDetailForm = forwardRef<ModelRef, ModalDetailFormProps>(
  (props: ModalDetailFormProps, ref) => {
    const [form] = Form.useForm();
    const { currentItem, modalType } = props;
    const {
      id = -1,
      parentId,
      name = '',
      menuType = 1,
      path = '',
      icon = '',
      menuOrder = 99,
      permission = '',
      remark = '',
    } = currentItem;
    const [menuTypeValue, setMenuTypeValue] = useState<number>(menuType);

    function onMenuTypeChange(e: RadioChangeEvent) {
      const radioValue = e.target.value;
      setMenuTypeValue(radioValue);
      form.resetFields();
      form.setFieldsValue({ menuType: radioValue });
    }

    function prefixLabel(itemName: string): React.ReactNode {
      if (itemName === 'name') {
        if (menuTypeValue === 1) {
          return '目录';
        }

        if (menuTypeValue === 2) {
          return '菜单';
        }
        return '按钮';
      }
      if (itemName === 'parentId') {
        if (menuTypeValue === 1 || menuTypeValue === 2) {
          return '目录';
        }
        return '菜单';
      }
      if (itemName === 'path') {
        if (menuTypeValue === 1 || menuTypeValue === 2) {
          return '路由';
        }
        return '显示标识';
      }
      return '';
    }

    const treeNodeFormatter = useCallback((node) => formatter(node, menuTypeValue), [
      menuTypeValue,
    ]);

    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <Form form={form}>
        <Row gutter={24}>
          <Col span={0}>
            <AInput name="id" initialValue={id} />
          </Col>
          <Col span={modalType === 'create' ? 24 : 0}>
            <ARadioGroup
              name="menuType"
              initialValue={menuType}
              label="类型"
              radioOptions={[
                {
                  value: 1,
                  label: '目录',
                  disabled: menuType === 3,
                },
                {
                  value: 2,
                  label: '菜单',
                  disabled: menuType === 3,
                },
                {
                  value: 3,
                  label: '按钮',
                  disabled: menuType === 1,
                },
              ]}
              rules={[
                {
                  required: true,
                  message: ' 请选择类型',
                },
              ]}
              formItemProps={formItemProps}
              widgetProps={{
                onChange: onMenuTypeChange,
              }}
            />
          </Col>
          <Col span={24}>
            <AInput
              name="name"
              initialValue={name}
              label={`${prefixLabel('name')}名称`}
              rules={[
                {
                  required: true,
                  message: `请输入${prefixLabel('name')}名称`,
                },
              ]}
              widgetProps={{
                placeholder: `请输入${prefixLabel('name')}名称`,
              }}
              formItemProps={formItemProps}
            />
          </Col>
          <Col span={24}>
            <ADynamicTree
              name="parentId"
              initialValue={[parentId]}
              label={`父级${prefixLabel('parentId')}`}
              rules={[
                {
                  required: true,
                  message: `请选择父级${prefixLabel('parentId')}`,
                },
              ]}
              action="/sys/menu/dic"
              asyncFn={asyncFn}
              formatter={treeNodeFormatter}
              widgetProps={{
                blockNode: true,
                autoExpandParent: true,
              }}
              formItemProps={formItemProps}
            />
          </Col>
          <Col span={24}>
            <AInput
              name="path"
              initialValue={path}
              label={prefixLabel('path')}
              rules={[
                {
                  required: true,
                  message: `请输入${prefixLabel('path')}`,
                },
              ]}
              widgetProps={{
                placeholder: `请输入${prefixLabel('path')}`,
              }}
              formItemProps={formItemProps}
            />
          </Col>

          {menuTypeValue === 1 ? null : (
            <Col span={24}>
              <AInput
                name="permission"
                initialValue={permission}
                label="授权标识"
                rules={[
                  {
                    required: true,
                    message: ' 请输入授权标识',
                  },
                ]}
                widgetProps={{
                  placeholder: '请输入授权标识',
                }}
                formItemProps={formItemProps}
              />
            </Col>
          )}
          {menuTypeValue === 1 || menuTypeValue === 2 ? (
            <Col span={24}>
              <AInput
                name="icon"
                initialValue={icon}
                label="图标"
                rules={[
                  {
                    required: menuTypeValue === 1,
                    message: ' 请输入图标',
                  },
                ]}
                widgetProps={{
                  placeholder: '请输入图标',
                }}
                formItemProps={formItemProps}
              />
            </Col>
          ) : null}

          <Col span={0}>
            <AInput name="isActive" initialValue={1} />
          </Col>
          <Col span={24}>
            <AInputNumber
              name="menuOrder"
              initialValue={menuOrder}
              label="排序"
              widgetProps={{
                placeholder: '请输入图标',
                style: { width: '100%' },
              }}
              formItemProps={formItemProps}
            />
          </Col>
          <Col span={24}>
            <AInputTextArea
              name="remark"
              initialValue={remark}
              label="备注"
              widgetProps={{
                placeholder: '请输入备注',
                autoSize: { minRows: 5, maxRows: 10 },
                style: { width: '100%' },
              }}
              formItemProps={formItemProps}
            />
          </Col>
        </Row>
      </Form>
    );
  },
);

export default ModalDetailForm;
