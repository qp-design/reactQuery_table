import UploadComponent from "./UploadComponent";
import React, { useState } from "react";
import PropTypes from "prop-types";
import XLSX from "xlsx";
import { message } from "antd";
import isEmpty from "lodash/isEmpty";

const UploadExcel = React.forwardRef(({ ...props }, ref) => {
  const [loading, setLoading] = useState(false);
  //
  const fieldprops = {
    name: "file",
    listType: "text",
    innerText: "建议传excel",
    maxLength: 1,
  };

  /**
   * selectedFile 文件
   * callback返回数据
   */
  const fileToJson = (selectedFile, callback) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      });
      workbook.SheetNames.forEach(function (sheetName) {
        const XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        callback(XL_row_object);
      });
    };
    reader.onerror = function (event) {
      console.error("File could not be read! Code " + event.target.error.code);
    };
    // 读取上传文件为二进制
    reader.readAsBinaryString(selectedFile);
  };

  const fileToJsonHandler = (...args) => {
    const [setFieldsValue, name, e] = args;
    setLoading(true);
    // 获取当前的文件名后缀进行判断是否可以解析
    const fileName = e.file.name;
    const fileArr = fileName.split(".");
    const fileSuffix = fileArr[fileArr.length - 1];
    if (["xlsx", "csv", "xls"].includes(fileSuffix)) {
      // 解析数据
      fileToJson(e.file, (sheets) => {
        const data = jsonToArray(sheets);
        if (isEmpty(data)) {
          message.info("当前Excel文件数据为空");
        }

        const uid = new Date().getTime();
        setFieldsValue({
          [name]: [
            {
              uid,
              data,
              name: e.file.name,
            },
          ],
        });
        setLoading(false);
      });
    } else {
      message.error("不支持该格式的解析");
      setLoading(false);
    }
  };

  /**
   * [{ key: value }] => [value]
   */
  const jsonToArray = (data) => {
    return data.map((item) =>
      props.valueTypeIsString
        ? Object.values(item).toString()
        : Object.values(item)
    );
  };

  return (
    <UploadComponent
      fieldprops={fieldprops}
      computedDataHandler={fileToJsonHandler}
      loading={loading}
      {...props}
    />
  );
});

UploadExcel.defaultProps = {
  valueTypeIsString: true,
};

UploadExcel.propTypes = {
  valueTypeIsString: PropTypes.bool,
  callback: PropTypes.func,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default UploadExcel;
