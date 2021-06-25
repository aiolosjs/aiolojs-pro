import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import AInputPassword from '@aiolosjs/components/lib/form/ainput/password';

export type Ref = {
  form: FormInstance;
};

export interface ModalDetailFormProps {}

const formItemProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const ModalDetailForm = forwardRef<Ref, ModalDetailFormProps>(
  (props: ModalDetailFormProps, ref) => {
    const [form] = Form.useForm();
    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <Form form={form}>
        <Row gutter={24}>
          <Col span={24}>
            <AInputPassword
              name="password"
              label="原密码"
              rules={[
                {
                  required: true,
                  message: '请输入原密码',
                },
              ]}
              widgetProps={{
                placeholder: '请输入原密码',
              }}
              formItemProps={formItemProps}
            />
          </Col>
          <Col span={24}>
            <AInputPassword
              name="newpassword"
              label="新密码"
              rules={[
                {
                  required: true,
                  message: '请输入新密码',
                },
              ]}
              widgetProps={{
                placeholder: '请输入新密码',
              }}
              formItemProps={formItemProps}
            />
          </Col>
          <Col span={24}>
            <AInputPassword
              name="confirmnewpassword"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请输入确认密码',
                },
                // @ts-ignore
                ({ getFieldValue }) => ({
                  validator(rule: any[], value: string | undefined) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入密码不一致'));
                  },
                }),
              ]}
              widgetProps={{
                placeholder: '请输入确认密码',
              }}
              formItemProps={{ ...formItemProps, dependencies: ['newpassword'] }}
            />
          </Col>
        </Row>
      </Form>
    );
  },
);

export default React.memo(ModalDetailForm);
