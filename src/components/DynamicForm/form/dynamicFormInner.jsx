import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Checkbox from "antd/lib/checkbox";
import Radio from "antd/lib/radio";
import DatePicker from "antd/lib/date-picker";
import Cascader from "antd/lib/cascader";
import Switch from "antd/lib/switch";
import { Field, AntdForm, Action } from "../proptypes";
import "moment/locale/zh-cn";
import fieldRules from "../proptypes/fieldRules";
import UploadFile from "../UploadFile";
import RenderSelect from "./RenderSelect";

moment.locale("zh-cn");
const { RangePicker } = DatePicker;

class DynamicFormInner extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(Field),
    feedbackIcons: PropTypes.bool,
    saveText: PropTypes.string,
    onSubmit: PropTypes.func,
    form: AntdForm.isRequired,
    layout: PropTypes.string,
    actions: PropTypes.arrayOf(Action),
    buttonId: PropTypes.string,
    transformSubmitDataConfig: PropTypes.object,
  };

  static defaultProps = {
    transformSubmitDataConfig: {},
    buttonId: "tax-submit",
    actions: [],
    formItemLayout: {},
    wrapperCol: {},
    fields: [],
    feedbackIcons: false,
    saveText: "查询",
    onSubmit: () => {},
    layout: "horizontal",
  };
  state = {
    isSubmitting: false,
    inProgressActions: [],
  };

  /**
   * @param e 当前表单控件的值
   * @param callback 当前表单控件的onChange事件触发的回调
   */
  callback = (callback, e) => {
    /**
     * 获取当前表单的值
     */
    callback(
      e,
      (msg) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue(msg);
      },
      () => {
        const { getFieldsValue } = this.props.form;
        return getFieldsValue();
      }
    );
  };

  renderFields = (fields) => {
    return fields.map((field) => {
      const FormItem = Form.Item;
      const {
        name,
        required,
        title,
        type,
        readOnly,
        autoFocus,
        callback,
        disabled,
      } = field;
      const fieldLabel = title;
      const { feedbackIcons, labelCol, wrapperCol } = this.props;

      const formItemProps = {
        className: ["render"].includes(type) ? "noafter" : "m-b-10",
        hasFeedback: type !== "checkbox" && type !== "file" && feedbackIcons,
        label: type === "checkbox" ? "" : fieldLabel,
        required,
      };

      const fieldProps = {
        className: readOnly ? "w-100 disabled" : "w-100",
        name,
        type,
        disabled,
        readOnly,
        autoFocus,
        placeholder: field.placeholder,
        "data-test": fieldLabel,
        size: field.size,
        ...field.props,
        onChange: (e, dataString) => {
          if (["dateRange", "date"].includes(type)) {
            callback && this.callback(callback, dataString);
          } else {
            callback && this.callback(callback, e);
          }
        },
      };

      return (
        <Fragment key={name}>
          {!field.hidden && (
            <FormItem
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              {...formItemProps}
            >
              {this.renderField(field, fieldProps)}
            </FormItem>
          )}
        </Fragment>
      );
    });
  };

  disabledDate(current) {
    return (
      current < moment(new Date("2020/01/01")) ||
      current > moment().endOf("day")
    );
  }

  renderField(field, props) {
    const { getFieldDecorator } = this.props.form;
    const { name, type, initialValue } = field;
    const fieldLabel = field.title;
    const options = {
      rules: fieldRules(field),
      valuePropName: ["checkbox", "switch"].includes(type)
        ? "checked"
        : "value",
      initialValue,
    };
    switch (type) {
      case "select":
        return (
          <RenderSelect field={field} props={props} form={this.props.form} />
        );
      case "file":
        return getFieldDecorator(
          name,
          options
        )(<UploadFile field={field} props={props} form={this.props.form} />);
      case "dateRange":
        return getFieldDecorator(
          name,
          options
        )(<RangePicker disabledDate={this.disabledDate} {...props} />);
      case "radioGroup":
        return getFieldDecorator(
          name,
          options
        )(<Radio.Group {...props} options={field.options} />);
      case "date":
        return getFieldDecorator(name, {
          ...options,
          initialValue: initialValue
            ? moment(initialValue, props.dateFormat)
            : null,
        })(<DatePicker {...props} renderExtraFooter={() => ""} />);
      case "checkbox":
        return getFieldDecorator(
          name,
          options
        )(<Checkbox {...props}>{fieldLabel}</Checkbox>);
      case "switch":
        return getFieldDecorator(name, options)(<Switch {...props} />);
      case "number":
        return getFieldDecorator(name, options)(<InputNumber {...props} />);
      case "cascader":
        return getFieldDecorator(
          name,
          options
        )(<Cascader options={field.options} {...props} />);
      case "textarea":
        return (
          <>{getFieldDecorator(name, options)(<Input.TextArea {...props} />)}</>
        );
      case "slot":
        return getFieldDecorator(
          name,
          options
        )(props.render(field, this.props.form));
      case "render":
        return props.render(field, this.props.form);
      default:
        return getFieldDecorator(name, options)(<Input {...props} />);
    }
  }

  render() {
    const { fields } = this.props;
    return <>{this.renderFields(fields)}</>;
  }
}

export default DynamicFormInner;
