import fieldRules from "./proptypes/fieldRules";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import Upload from "antd/lib/upload";
import React, { useMemo } from "react";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import omit from "lodash/omit";

const UploadComponent = ({ field, form, ...props }) => {
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  let { name, initialValue, readOnly } = field;

  const needChangeInitialValue = useMemo(() => {
    const getChangeArrData = Array.isArray(initialValue)
      ? initialValue
      : initialValue
      ? [initialValue]
      : [];
    return getChangeArrData.map((item, index) => {
      return {
        uid: item.id || index,
        url: item,
      };
    });
  }, [initialValue]);

  const fieldsProps = {
    name,
    disabled: readOnly,
    readOnly,
    placeholder: field.placeholder,
    ...props.fieldprops,
    ...omit(field.props, "render"),
  };

  const base64File = (fieldName, e) => {
    if (isEmpty(e.fileList)) {
      return;
    }
    if (props.computedDataHandler) {
      props.computedDataHandler(setFieldsValue, fieldName, e);
    }
    return e.fileList;
  };

  const fileOptions = {
    rules: fieldRules(field),
    valuePropName: "fileList",
    initialValue: needChangeInitialValue,
    getValueFromEvent: base64File.bind(null, name),
  };

  const disabled = isUndefined(getFieldValue(name))
    ? false
    : getFieldValue(name).length >= (field.props.maxLength || 1);
  const uploadButton = <Spin spinning={props.loading}>
    <Icon type="plus" />
    <div className="ant-upload-text">{fieldsProps.innerText}</div>
  </Spin>


  const upload = (
    <Upload {...fieldsProps} beforeUpload={() => false}>
      {disabled ? null : uploadButton}
    </Upload>
  );
  return getFieldDecorator(name, fileOptions)(upload);
};

UploadComponent.propTypes = {
  computedDataHandler: PropTypes.func,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};
export default UploadComponent;
