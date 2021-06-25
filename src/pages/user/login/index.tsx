import React from 'react';
import { useSelector } from 'umi';
import type { LoginStateProps } from '@/models/login';
import styles from './style.less';
import defaultSettings from '../../../../config/defaultSettings';
import AccountForm from './accountForm';
import PhoneForm from './phoneForm';

const { title } = defaultSettings;

interface IRootState {
  login: LoginStateProps;
}
export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { login } = useSelector((state: IRootState) => state);
  const { mobileValid } = login;
  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      {!mobileValid ? <AccountForm /> : <PhoneForm />}
    </div>
  );
};

export default Login;
