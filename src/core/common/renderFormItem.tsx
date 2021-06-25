import React from 'react';
import * as AiolosJSComponents from '@aiolosjs/components';
import type { IBaseWidgetProps } from '@aiolosjs/components/lib/form/types';
import { asyncFn } from '@/utils/utils';

import { tuple } from '@/utils/types';

const WidgetTypes = tuple(
  'AAutoComplete',
  'ACascader',
  'ACheckboxGruop',
  'ADatePicker',
  'ADateRangePicker',
  'ADynamicAutoComplete',
  'ADynamicCascader',
  'ADynamicSelect',
  'ADynamicSelectGroup',
  'ADynamicTree',
  'ADynamicTreeSelect',
  'AInput',
  'AInputPassword',
  'AInputPhone',
  'AInputNumber',
  'AInputTextArea',
  'ARadioGroup',
  'ASelect',
  'ASelectGroup',
  'ASwitch',
  'ATimePicker',
  'ATree',
  'ATreeSelect',
  'AUpload',
);
export type WidgetType = typeof WidgetTypes[number];

export interface RenderFormItemProps extends IBaseWidgetProps {
  widget: WidgetType;
  required?: boolean;
  colSpan?: number;
  [key: string]: any;
}

export default <T extends WidgetType>(item: RenderFormItemProps) => {
  const { label, widget, rules = [], required, widgetProps = {}, ...restWidgetProps } = item;
  const text = widget.includes('AInput') ? '请输入' : '请选择';
  const defaultRule = required
    ? [
        {
          required,
          message: `${text}${label}`,
        },
      ]
    : [];
  const defaultPlaceholder = `${text}${label}`;
  const widgetRules = [...defaultRule, ...rules];

  if (
    widget === 'AInput' ||
    widget === 'AInputPassword' ||
    widget === 'AInputPhone' ||
    widget === 'AInputNumber' ||
    widget === 'AInputTextArea'
  ) {
    const AInputType = widget.replace('AInput', '');
    const AInputWidget =
      AInputType === '' ? AiolosJSComponents.AInput : AiolosJSComponents.AInput[AInputType];

    return (
      <AInputWidget
        label={label}
        rules={widgetRules}
        widgetProps={{ placeholder: defaultPlaceholder, ...widgetProps }}
        {...restWidgetProps}
      />
    );
  }

  const WidgetComponent = AiolosJSComponents[widget];

  if (widget.startsWith('ADynamic')) {
    return (
      <WidgetComponent
        label={label}
        rules={widgetRules}
        widgetProps={{ placeholder: defaultPlaceholder, ...widgetProps }}
        asyncFn={asyncFn}
        {...restWidgetProps}
      />
    );
  }

  return (
    <WidgetComponent
      label={label}
      rules={widgetRules}
      widgetProps={{ placeholder: defaultPlaceholder, ...widgetProps }}
      {...restWidgetProps}
    />
  );
};
