import ReactDOM from 'react-dom'
import { Drawer } from 'antd';

const drawerJsx = (DrawerComponent, props) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  function render() {
    ReactDOM.render(
      <Drawer
        visible={true}
        footer={null}
        {...props.drawerConfig}
        onClose={destroyDialog}
      >
        <DrawerComponent
          destroyDialog={destroyDialog}
          {...props.restsProps}
        />
      </Drawer>,
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

export default drawerJsx;
