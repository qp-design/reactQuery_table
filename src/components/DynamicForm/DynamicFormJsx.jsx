import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Checkbox from "antd/lib/checkbox";
import Button from "antd/lib/button";
import Radio from "antd/lib/radio";
import DatePicker from "antd/lib/date-picker";
import message from "antd/lib/message";
import Cascader from "antd/lib/cascader";
import Switch from "antd/lib/switch";
import { Field, AntdForm, Action } from "./proptypes";
import "moment/locale/zh-cn";
import fieldRules from "./proptypes/fieldRules";
import get from "lodash/get";
import set from "lodash/set";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";
import UploadFile from "./UploadFile";
import RenderSelect from "./form/RenderSelect";

moment.locale("zh-cn");
const { RangePicker } = DatePicker;

class DynamicFormJsx extends React.Component {
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

  computedSubmitValues = (values) => {
    const { transformSubmitDataConfig } = this.props;
    if (isEmpty(transformSubmitDataConfig)) {
      return values;
    }
    const getParamsConfig = Object.keys(transformSubmitDataConfig);
    getParamsConfig.forEach((item) => {
      const value = get(values, item);
      let getComputedValue = void 0;
      const configData = transformSubmitDataConfig[item];
      if (Array.isArray(configData) && value) {
        configData.forEach((selectObj, index) => {
          const defaultValue = index === 0 ? value : "0001-01-01";
          const momentValue = value[index] || defaultValue;
          getComputedValue = selectObj.value
            ? selectObj.value(momentValue)
            : momentValue;
          set(values, selectObj.code, getComputedValue);
        });
        values = omit(values, item);
      } else {
        getComputedValue = configData.value ? configData.value(value) : value;
        set(values, configData.code, getComputedValue);
      }
    });
    return values;
  };

  handleSubmit = (e) => {
    this.setState({ isSubmitting: true });
    e && e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(
          this.computedSubmitValues(values),
          (msg) => {
            const { setFieldsValue, getFieldsValue } = this.props.form;
            this.setState({ isSubmitting: false });
            setFieldsValue(getFieldsValue()); // reset form touched state
            msg && message.success(msg);
          },
          (msg) => {
            this.setState({ isSubmitting: false });
            msg && message.error(msg);
          }
        );
      } else {
        this.setState({ isSubmitting: false });
      }
    });
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
      const { feedbackIcons } = this.props;

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
            <FormItem {...formItemProps}>
              {this.renderField(field, fieldProps)}
            </FormItem>
          )}
        </Fragment>
      );
    });
  };

  disabledDate(current) {
    return (
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
        return getFieldDecorator(
          name,
          options
        )(<RenderSelect field={field} props={props} form={this.props.form} />);
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
      case "checkGroup":
        return getFieldDecorator(
          name,
          options
        )(<Checkbox.Group {...props} options={field.options} />);
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

  setActionInProgress = (actionName, inProgress) => {
    this.setState((prevState) => ({
      inProgressActions: {
        ...prevState.inProgressActions,
        [actionName]: inProgress,
      },
    }));
  };

  handleAction = (e) => {
    e && e.preventDefault();
    const actionName = e.target.dataset.action;
    this.setActionInProgress(actionName, true);
    const callObj = this.props.actions.find((item) => item.name === actionName);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        callObj.callback(this.computedSubmitValues(values), () => {
          this.setActionInProgress(actionName, false);
        }, this.props.form);
      } else {
        this.setActionInProgress(actionName, false);
      }
    });
  };

  renderActions() {
    return this.props.actions.map((action) => {
      const inProgress = this.state.inProgressActions[action.name];
      const actionProps = {
        className: action.pullRight ? "pull-right m-t-10" : "m-t-10",
        key: action.name,
        type: action.type,
        loading: inProgress,
        onClick: this.handleAction,
      };

      return (
        <Button {...actionProps} data-action={action.name}>
          {action.name}
        </Button>
      );
    });
  }

  render() {
    const { saveText, layout, fields, wrapperCol, formItemLayout, buttonId } =
      this.props;
    const submitProps = {
      type: "primary",
      htmlType: "submit",
      disabled: this.state.isSubmitting,
      loading: this.state.isSubmitting,
    };
    return (
      <Form {...formItemLayout} layout={layout}>
        {this.renderFields(fields)}

        <Form.Item wrapperCol={wrapperCol}>
          <>
            {saveText && (
              <Button
                id={buttonId}
                className={buttonId}
                type="primary"
                {...submitProps}
                onClick={this.handleSubmit}
              >
                {saveText}
              </Button>
            )}
            {this.renderActions()}
          </>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(DynamicFormJsx);
