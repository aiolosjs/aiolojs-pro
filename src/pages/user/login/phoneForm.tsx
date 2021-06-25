import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Button } from 'antd';
import { SecurityScanOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'umi';
import type { LoginStateProps } from '@/models/login';
import { AInput, ASelect } from '@aiolosjs/components';

import styles from './style.less';

interface IRootState {
  login: LoginStateProps;
}

export interface PhoneFormProps {}

const errorMsg = {
  200: '登录成功',
  100: '验证码错误',
  101: '用户名或密码错误',
};

const countTotal = 5;

const PhoneForm: React.FC<PhoneFormProps> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { login } = useSelector((state: IRootState) => state);
  const [captchaText, setCaptchaText] = useState<string>('获取验证码');
  const [disabled, setDisabled] = useState<boolean>(false);
  const intervalRef = useRef<number | undefined>();
  const { loading, statusCode = 200, mobiles = [] } = login;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  function countDownHandle() {
    setDisabled(true);
    let countNum = 0;
    intervalRef.current = window.setInterval(() => {
      countNum += 1;
      if (countNum > countTotal) {
        clearInterval(intervalRef.current);
        countNum = 0;
        setCaptchaText('获取验证码');
        setDisabled(false);
      } else {
        setCaptchaText(`${countTotal - countNum}s后重新获取`);
      }
    }, 1000);
  }

  function onGetCaptcha() {
    form
      .validateFields(['mobile'])
      .then((values) => {
        countDownHandle();
        dispatch({
          type: 'login/getCaptcha',
          payload: values,
        });
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }

  function onFinish(value: any) {
    dispatch({
      type: 'login/mobileLoginIn',
      payload: value,
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
        <Form onFinish={onFinish} form={form}>
          <Row>
            <Col span={24}>
              <ASelect
                name="mobile"
                form={form}
                label={null}
                rules={[
                  {
                    required: true,
                    message: `请选择手机号码`,
                  },
                ]}
                selectOptions={mobiles}
                widgetProps={{
                  placeholder: `请选择手机号码`,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                }}
              />
            </Col>
            <Col span={24}>
              <div className={styles.qrcodeBox}>
                <div style={{ width: '55%' }}>
                  <AInput
                    name="smscode"
                    form={form}
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
                  <Button size="large" onClick={onGetCaptcha} disabled={disabled}>
                    {captchaText}
                  </Button>
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
                验证
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default PhoneForm;
