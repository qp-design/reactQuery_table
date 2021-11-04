import { Modal } from 'antd';
const {confirm} = Modal;
export const deleteModel = (callback, title = '删除', text = '您确定要删除么') => {
  confirm({
    title,
    content: text,
    onOk() {
      callback();
    }
  });
};
