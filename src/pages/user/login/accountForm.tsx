import React, { useEffect } from 'react';
import { Form, Row, Col, Alert, Button } from 'antd';
import { useSelector, useDispatch } from 'umi';
import { UserOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons';

import { LoginStateProps } from '@/models/login';
import { AInput } from '@aiolosjs/components';
import AInputPassword from '@aiolosjs/components/lib/form/ainput/password';
import QRcode from './component/QRcode';

import styles from './style.less';

interface IRootState {
  login: LoginStateProps;
}

export interface AccountFormProps {}

const errorMsg = {
  200: '登录成功',
  100: '验证码错误',
  101: '用户名或密码错误',
};

const AccountForm: React.FC<AccountFormProps> = () => {
  const dispatch = useDispatch();
  const { login } = useSelector((state: IRootState) => state);
  const { loading, image = '', statusCode = 200, isRefreshCode, key } = login;

  function refreshCode() {
    dispatch({
      type: 'login/getImageCaptcha',
    });
  }

  useEffect(() => {
    if (statusCode < 200 && isRefreshCode) {
      refreshCode();
    }
  }, [isRefreshCode, statusCode]);

  function onFinish(value: any) {
    dispatch({
      type: 'login/loginIn',
      payload: { ...value, key },
    });
  }

  return (
    <div>
      {statusCode < 200 ? (
        <div className={styles.errorMsg}>
          <Alert message={errorMsg[statusCode]} type="error" showIcon />
        </div>
      ) : null}
      <div className={styles.content}>
        <Form onFinish={onFinish}>
          <Row>
            <Col span={24}>
              <AInput
                name="username"
                label={null}
                rules={[
                  {
                    required: true,
                    message: `请输入用户名`,
                  },
                ]}
                widgetProps={{
                  placeholder: `请输入用户名`,
                  prefix: <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />,
                  size: 'large',
                }}
              />
            </Col>
            <Col span={24}>
              <AInputPassword
                name="password"
                label={null}
                rules={[
                  {
                    required: true,
                    message: `请输入密码`,
                  },
                ]}
                widgetProps={{
                  placeholder: `请输入密码`,
                  prefix: <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />,
                  size: 'large',
                }}
              />
            </Col>
            <Col span={24}>
              <div className={styles.qrcodeBox}>
                <div style={{ width: '60%' }}>
                  <AInput
                    name="code"
                    label={null}
                    rules={[
                      {
                        required: true,
                        message: `请输入验证码`,
                      },
                    ]}
                    widgetProps={{
                      placeholder: `请输入验证码`,
                      prefix: <SecurityScanOutlined style={{ color: 'rgba(0,0,0,.25)' }} />,
                      size: 'large',
                    }}
                  />
                </div>
                <div>
                  <QRcode image={image} onChange={refreshCode} />
                </div>
              </div>
            </Col>

            <Col span={24}>
              <Button
                className={styles.submitBtn}
                type="primary"
                size="large"
                loading={loading}
                htmlType="submit"
              >
                登录
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AccountForm;
