import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Form, Row, Col } from 'antd';
import {
  AInput,
  ADynamicTreeSelect,
  ADynamicSelect,
  ADynamicTree,
  ARadioGroup,
} from '@aiolosjs/components';
import { FormInstance } from 'antd/es/form/Form';
import { asyncFn } from '@/utils/utils';
import { OperatorKeys } from './interface';

export type ModelRef = {
  form: FormInstance;
};

export interface ModalDetailFormProps {
  currentItem: { [key: string]: any };
  modalType: OperatorKeys;
}

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

const formItemProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const ModalDetailForm = forwardRef<ModelRef, ModalDetailFormProps>(
  (props: ModalDetailFormProps, ref) => {
    const { currentItem, modalType } = props;
    const [form] = Form.useForm();
    const [action, setAction] = useState<string | null>(null);
    const [sysGroupIdValues, setSysGroupIdValues] = useState(currentItem.sysGroupId);

    useImperativeHandle(ref, () => ({
      form,
    }));

    useEffect(() => {
      if (sysGroupIdValues !== undefined) {
        setAction(`/sys/group/dic?key=${sysGroupIdValues}`);
      }
    }, [sysGroupIdValues]);

    const onGroupAuthorizedChange = (value: any) => {
      form.resetFields(['groupAuthorizedIds']);
      setSysGroupIdValues(value);
    };

    if (modalType === 'create') {
      Object.assign(currentItem, {
        autoAuthorized: 1,
        password: '123456',
        confirm: '123456',
      });
    }

    return (
      <Form form={form} initialValues={currentItem}>
        <Row gutter={24}>
          {(modalType === 'create' || modalType === 'update' || modalType === 'updatePassword') && (
            <Col span={0}>
              <AInput
                name="id"
                label="姓名"
                rules={[
                  {
                    required: false,
                    message: ' 请输入',
                  },
                ]}
              />
            </Col>
          )}
          {(modalType === 'create' || modalType === 'update' || modalType === 'updatePassword') && (
            <Col span={12}>
              <AInput
                name="username"
                label="登录账号"
                formItemProps={formItemProps}
                rules={[
                  {
                    required: true,
                    message: ' 请输入登录账号',
                  },
                ]}
                widgetProps={{
                  placeholder: '请输入登录账号',
                  disabled: modalType === 'updatePassword',
                }}
              />
            </Col>
          )}
          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <AInput
                name="nickname"
                label="姓名"
                formItemProps={formItemProps}
                rules={[
                  {
                    required: true,
                    message: ' 请输入姓名',
                  },
                ]}
                widgetProps={{ placeholder: '请输入姓名' }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <AInput.Phone
                name="mobile"
                label="手机号码"
                formItemProps={formItemProps}
                rules={[
                  {
                    required: true,
                    message: ' 请输入手机号码',
                  },
                ]}
                widgetProps={{ placeholder: '请输入手机号码' }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <AInput
                name="email"
                label="邮箱"
                formItemProps={formItemProps}
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                    message: ' 邮箱格式不正确',
                  },
                ]}
                widgetProps={{ placeholder: '请输入邮箱' }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'updatePassword') && (
            <Col span={12}>
              <AInput.Password
                name="password"
                label="登陆密码"
                // initialValue="123456"
                formItemProps={formItemProps}
                rules={[
                  {
                    required: true,
                    message: ' 请输入登陆密码',
                  },
                ]}
                widgetProps={{ placeholder: '请输入登陆密码' }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'updatePassword') && (
            <Col span={12}>
              <AInput.Password
                name="confirm"
                label="确认密码"
                // initialValue="123456"
                formItemProps={{ ...formItemProps, dependencies: ['password'] }}
                rules={[
                  {
                    required: true,
                    message: ' 请输入确认密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_: any, value: string | undefined) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入密码不一致'));
                    },
                  }),
                ]}
                widgetProps={{ placeholder: '请输入确认密码' }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <ADynamicTreeSelect
                name="sysGroupId"
                label="所属客户"
                action="/sys/group/dic"
                asyncFn={asyncFn}
                formItemProps={formItemProps}
                formatter={formatter}
                rules={[
                  {
                    required: true,
                    message: '请选择所属客户',
                  },
                ]}
                widgetProps={{
                  // @ts-ignore
                  getPopupContainer: () => document.querySelector('.ant-modal-wrap '),
                  treeDefaultExpandAll: true,
                  dropdownStyle: {
                    maxHeight: 360,
                  },
                  placeholder: '请选择所属客户',
                  onChange: onGroupAuthorizedChange,
                }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <ADynamicSelect
                name="roleId"
                label="角色权限"
                action="/sys/role/dic"
                asyncFn={asyncFn}
                formItemProps={formItemProps}
                rules={[
                  {
                    required: true,
                    message: '请选择角色权限',
                  },
                ]}
                widgetProps={{
                  // @ts-ignore
                  getPopupContainer: () => document.querySelector('.ant-modal-wrap '),

                  placeholder: '请选择角色权限',
                }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <ADynamicTree
                name="groupAuthorizedIds"
                label="数据权限"
                asyncFn={asyncFn}
                action={action}
                formatter={formatter}
                formItemProps={{ ...formItemProps }}
                rules={[
                  {
                    required: true,
                    message: '请选择数据权限',
                  },
                ]}
                treeCheckParentStrictly
                widgetProps={{
                  // @ts-ignore
                  getPopupContainer: () => document.querySelector('.ant-modal-wrap '),
                  checkable: true,
                  checkStrictly: true,
                  selectable: false,
                  placeholder: '请选择数据权限',
                }}
              />
            </Col>
          )}

          {(modalType === 'create' || modalType === 'update') && (
            <Col span={12}>
              <ARadioGroup
                name="autoAuthorized"
                label="自动授权"
                radioOptions={[
                  {
                    label: '启用',
                    value: 1,
                  },
                  {
                    label: '不启用',
                    value: 0,
                  },
                ]}
                formItemProps={{ ...formItemProps }}
                rules={[
                  {
                    required: true,
                    message: '请选择自动授权',
                  },
                ]}
                widgetProps={{
                  // @ts-ignore
                  getPopupContainer: () => document.querySelector('.ant-modal-wrap '),

                  placeholder: '请选择自动授权',
                }}
              />
            </Col>
          )}
        </Row>
      </Form>
    );
  },
);

export default React.memo(ModalDetailForm);
