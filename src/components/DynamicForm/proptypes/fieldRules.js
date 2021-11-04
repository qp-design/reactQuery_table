import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";

const fieldRules = ({
  type,
  required,
  minLength,
  msginfo,
  slotRulesInfo = {},
}) => {
  const requiredRule = required;
  const minLengthRule =
    minLength && includes(["text", "email", "password"], type);
  const emailTypeRule = type === "email";
  return [
    requiredRule && { required, message: msginfo || "必填字段." },
    minLengthRule && { min: minLength, message: "字段过短." },
    emailTypeRule && { type: "email", message: "填入邮件格式." },
    !isEmpty(slotRulesInfo) && slotRulesInfo,
  ].filter((rule) => rule);
};

export default fieldRules;
