import fieldRules from "../proptypes/fieldRules";
import React from "react";
import PropTypes from "prop-types";
import Input from 'antd/lib/input'

const RenderInput = React.forwardRef(({ field, form }, ref) => {
  const { getFieldDecorator } = form;
  const {
    name,
    initialValue,
    ...props
  } = field;
  const decoratorOptions = {
    rules: fieldRules(field),
    initialValue,
  };
  return getFieldDecorator(
    name,
    decoratorOptions
  )(
    <Input {...props} />
  );
});

RenderInput.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};
export default RenderInput;
