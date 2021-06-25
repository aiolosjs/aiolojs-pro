import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Button } from 'antd';
import type { FormProps, FormInstance } from 'antd/es/form/Form';

import type { RenderFormItemProps } from '@/core/common/renderFormItem';
import renderFormItem from '@/core/common/renderFormItem';

export type SearchFormRef = {
  form: FormInstance;
};

export interface SearchFormProps {
  formItems: RenderFormItemProps[] | [];
  formProps?: FormProps;
  onSubmit?: <T extends {}>(fieldsValue: T) => void;
  onReset?: () => void;
}

const SearchForm = forwardRef<SearchFormRef, SearchFormProps>((props: SearchFormProps, ref) => {
  const [form] = Form.useForm();

  const { formItems = [], onSubmit, onReset, formProps = {} } = props;

  useImperativeHandle(ref, () => ({
    form,
  }));

  const renderItem = () => {
    let totalColSpan = 0;
    const newFormItems = formItems.map((item) => {
      const { colSpan = 8 } = item;
      totalColSpan += colSpan;
      if (totalColSpan > 24) {
        totalColSpan = colSpan;
      }
      return (
        <Col span={colSpan} key={item.name}>
          {renderFormItem(item)}
        </Col>
      );
    });
    const isOneLine = totalColSpan + 8 > 24;
    newFormItems.push(
      <Col
        span={isOneLine ? 24 : 8}
        style={{
          textAlign: isOneLine ? 'right' : 'left',
        }}
        key="btnList"
      >
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={handleReset}>
          重置
        </Button>
      </Col>,
    );
    return newFormItems;
  };

  function onFinish(values: any) {
    if (onSubmit) {
      onSubmit(values);
    }
  }

  function handleReset() {
    form.resetFields();
    if (onReset) {
      onReset();
    }
  }

  return (
    <Form form={form} onFinish={onFinish} {...formProps}>
      <Row gutter={24}>{renderItem()}</Row>
    </Form>
  );
});

export default React.memo(SearchForm);
