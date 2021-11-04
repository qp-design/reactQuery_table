/*
 * @Author: your name
 * @Date: 2021-01-18 10:46:28
 * @LastEditTime: 2021-01-25 17:20:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \community-admin-web\src\libs\proptypes\index.js
 */
import PropTypes from "prop-types";

export const Field = PropTypes.shape({
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOf([
    "slot",
    "button",
    "switch",
    "cascader",
    "text",
    "radioGroup",
    "textarea",
    "email",
    "password",
    "number",
    "checkbox",
    "checkGroup",
    "file",
    "select",
    "content",
    "dateRange",
    "date",
    "render",
  ]).isRequired,
  initialValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.array,
  ]),
  selectslot: PropTypes.func,
  content: PropTypes.node,
  mode: PropTypes.string,
  required: PropTypes.bool,
  extra: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  minLength: PropTypes.number,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  props: PropTypes.object, // eslint-disable-line react/forbid-prop-types
});
export const AntdForm = PropTypes.shape({
  validateFieldsAndScroll: PropTypes.func,
  resetFields: PropTypes.func,
});

export const Action = PropTypes.shape({
  name: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  type: PropTypes.string,
  pullRight: PropTypes.bool,
});
