import { Button } from "antd";

const ActionsJsx = ({record, actions}) => (
  <>
    {
      actions.map(({code, name, ...restProps}) =>
        <Button
          {...restProps}
          key={code}
          data-record={JSON.stringify(record)}
          data-action={code}>
          {name}
        </Button>
      )
    }
  </>
)

export default ActionsJsx;
