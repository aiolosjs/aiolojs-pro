import React, { useRef } from 'react';
import { Descriptions, Card, Modal } from 'antd';
import { useSelector, useDispatch } from 'umi';
import { UserModelState } from '@/models/user';

import DetailFormInfo, { Ref } from './modalDetailForm';

interface IRootState {
  user: UserModelState;
}
const UserSettings: React.FC = () => {
  const dispatch = useDispatch();
  const detailFormRef = useRef<Ref | null>(null);

  const { user: userInfo } = useSelector((state: IRootState) => state);
  const { currentUser = {}, modalVisible, confirmLoading } = userInfo;
  const { user = {} } = currentUser;
  const { username, mobile, nickname, email } = user;

  const changeModalVisibel = (flag: boolean) => {
    dispatch({
      type: 'user/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const hideModalVisibel = () => {
    changeModalVisibel(false);
  };

  const modalOkHandle = () => {
    if (detailFormRef && detailFormRef.current) {
      detailFormRef.current.form.validateFields().then((fieldsValue) => {
        dispatch({
          type: 'user/updatePassword',
          payload: fieldsValue,
        });
      });
    }
  };

  return (
    <>
      <Card title="个人中心" bordered={false} style={{ width: 350 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="用户名">{username}</Descriptions.Item>
          <Descriptions.Item label="手机号">{mobile}</Descriptions.Item>
          <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
          <Descriptions.Item label="密码">
            <a onClick={() => changeModalVisibel(true)}>修改密码</a>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal
        title="修改密码"
        destroyOnClose
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={hideModalVisibel}
        onOk={modalOkHandle}
      >
        <DetailFormInfo ref={detailFormRef} />
      </Modal>
    </>
  );
};

export default UserSettings;
