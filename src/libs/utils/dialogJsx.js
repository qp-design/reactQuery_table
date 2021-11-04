import ReactDOM from 'react-dom'
import { Modal } from 'antd';

const diaglogJsx = (DialogComponent, props) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  function render() {
    ReactDOM.render(
      <Modal
        visible={true}
        footer={null}
        {...props.dialogConfig}
        onCancel={destroyDialog}
      >
        <DialogComponent
          destroyDialog={destroyDialog}
          {...props.restsProps}
        />
      </Modal>,
      container);
  }

  function destroyDialog() {
    // Allow calling chain to roll up, and then destroy component
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }, 10);
  }

  render()

};

export default diaglogJsx;
