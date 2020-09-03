import React from 'react';
import { useSelector } from 'dva';
import { CurrentUser } from '@/models/user';
import defaultSettings from '../../../config/defaultSettings';

const { isLocalMenus } = defaultSettings;

export interface AuthBlockProps {
  authority: string;
  children?: React.ReactElement;
}
interface IRootState {
  user: {
    currentUser:CurrentUser
  };
}

const AuthBlock: React.FC<AuthBlockProps> = ({ children, authority }) => {
  const { user:{currentUser} } = useSelector((state: IRootState) => state);
  const { btn = [] } = currentUser;

  if (isLocalMenus) {
    return <>{children}</>;
  }

  const content = btn.findIndex(item => item.permission === authority) !== -1 ? children : null;
  return <>{content}</>;
};

export default React.memo(AuthBlock);
