import React from 'react';
import { Button, Result } from 'antd';
import { history } from 'umi';

const Exception404 = () => {
  const clearState = () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _models = [], _store = {} } = window.g_app || {};
    const { dispatch } = _store;
    _models
      .filter((m: any) => m.namespace !== '@@dva')
      .forEach((m: any) => {
        dispatch({
          type: `${m.namespace}/clear`,
          payload: {
            modalVisible: false,
            confirmLoading: false,
          },
        });
      });
    history.goBack();
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，你访问的接口或页面不存在."
      extra={
        <Button
          type="primary"
          onClick={() => {
            clearState();
          }}
        >
          刷新
        </Button>
      }
    />
  );
};

export default Exception404;
