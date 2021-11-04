import React, {useEffect, useImperativeHandle, useRef, useState} from 'react'
import DynamicFormJsx from './DynamicFormJsx'
import get from 'lodash/get';
import PropTypes from 'prop-types'

const DForm = React.forwardRef(({ ...props }, ref) => {
  const [fields, setFields] = useState([]);
  const refs = useRef();

  useEffect(() => {
    const arr = props.formFields.map(citem => {
      const item = {...citem};
      item.initialValue = get(props.context, item.name, item.initialValue);
      return item;
    });
    setFields(arr)
  }, [props.formFields, props.context]);

  useImperativeHandle(ref, () => ({
    refs: refs.current
  }));

  const onConfirm = (...params) => {
    props.confirmCallback(params, props.closeCallBack);
  };

  return (
    <DynamicFormJsx
      ref={refs}
      {...props}
      onSubmit={onConfirm}
      fields={fields}
    />
  )
});

DForm.defaultProps = {
  confirmCallback: () => {},
  closeCallBack: () => {},
  layout: undefined,
  saveText: undefined,
  wrapperCol: { span: 14, offset: 8 },
  formItemLayout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  },
  formFields: [],
};

DForm.propTypes = {
  resetform: PropTypes.func,
  formItemLayout: PropTypes.object,
  wrapperCol: PropTypes.object,
  confirmCallback: PropTypes.func,
  closeFunc: PropTypes.func,
  context: PropTypes.shape({
    confirmCallback: PropTypes.func,
    closeFunc: PropTypes.func,
  }),
  formFields: PropTypes.array,
  saveText: PropTypes.string,
  layout: PropTypes.string
};

export default DForm;
