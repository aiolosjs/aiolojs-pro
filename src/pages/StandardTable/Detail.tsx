import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Card, Descriptions } from 'antd';

import type { IRootState } from './interface';
import type { StandardTableDataProps } from './model';

export interface DetailProps {
  currentItem: Partial<StandardTableDataProps>;
}

const DetailInfo: React.FC<DetailProps> = ({ currentItem }) => {
  const dispatch = useDispatch();
  const { standardtable, loading } = useSelector((state: IRootState) => state);
  const { detailInfo = {} } = standardtable;
  const dataLoading = loading.effects['standardtable/fetchDetailInfo'];

  useEffect(() => {
    const { id } = currentItem;
    dispatch({
      type: 'standardtable/fetchDetailInfo',
      payload: { id },
    });
  }, []);

  const { name, sex } = detailInfo;

  return (
    <div>
      <Card loading={dataLoading}>
        <Descriptions>
          <Descriptions.Item label="姓名">{name}</Descriptions.Item>
          <Descriptions.Item label="性别">{sex}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default DetailInfo;
