import UploadComponent from "./UploadComponent";
// import { uploadImg } from '../../pages/aide/aideGroupJoinConfig/service'
import React, { useState } from "react";
import PropTypes from "prop-types";
const UploadFile = React.forwardRef(({ ...props }, ref) => {
  const [loading, setLoading] = useState(false);

  const ossUpload = (...args) => {
    const [setFieldsValue, fieldName, e] = args;
    setLoading(true);
    // uploadImg(e)
    //   .then((res) => {
    //     let obj = {
    //       uid: new Date().getTime(),
    //       url: res.data,
    //     }
    //     setFieldsValue({
    //       [fieldName]: [obj],
    //     });
    //     /**
    //      * 文件OSS上传后 获取值之后回调
    //      */
    //     props.callback && props.callback(setFieldsValue, [obj]);
    //   })
    //   .catch(() => {})
    //   .finally(() => setLoading(false));
  };

  return (
    <UploadComponent
      computedDataHandler={ossUpload}
      loading={loading}
      {...props}
    />
  );
});

UploadFile.propTypes = {
  callback: PropTypes.func,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default UploadFile;
