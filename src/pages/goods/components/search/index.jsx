import React, { memo } from 'react';
import { fieldsData } from '@/pages/goods/config';
import debounce from 'lodash/debounce'
import DForm from 'components/DynamicForm/Index';
import {useParamsContext} from "@/context";

const GoodsSearch = memo(() => {
  const { setParams } = useParamsContext();
  const onConfirm = debounce((props) => {
    let [value, suc] = props;
    suc();
    setParams(value)
  }, 200);

  return (
    <DForm
      formFields={fieldsData}
      wrapperCol={{}}
      formItemLayout={{}}
      layout='inline'
      confirmCallback={onConfirm}
    />
  )
});

export default GoodsSearch;
