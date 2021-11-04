import Select from "antd/lib/select";
import fieldRules from "../proptypes/fieldRules";
import React from "react";
import PropTypes from "prop-types";

const RenderSelect = React.forwardRef(({ field, props, form }, ref) => {
  const { getFieldDecorator } = form;
  const {
    name,
    options,
    mode,
    initialValue,
    readOnly,
    loading,
    optionKey,
    optionName,
  } = field;
  const { Option } = Select;
  const decoratorOptions = {
    rules: fieldRules(field),
    initialValue,
  };
  return getFieldDecorator(
    name,
    decoratorOptions
  )(
    <Select
      showSearch
      {...props}
      allowClear={!field.allowClear}
      optionFilterProp="children"
      loading={loading || false}
      mode={mode}
      disabled={props.readOnly}
      optionLabelProp="label"
      getPopupContainer={(trigger) => {
        if (trigger) {
          return trigger.parentNode;
        } else {
          return document.body;
        }
      }}
    >
      {options &&
        options.map((option) => (
          <Option
            key={option[optionKey || "key"]}
            value={option[optionKey || "key"]}
            label={option[optionName || "name"]}
            disabled={readOnly || option["disabled"]}
          >
            {option[optionName || "name"]}
          </Option>
        ))}
    </Select>
  );
});

RenderSelect.defaultProps = {
  props: {},
};
RenderSelect.propTypes = {
  props: PropTypes.object,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};
export default RenderSelect;
