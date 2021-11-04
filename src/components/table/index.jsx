import { useEffect, useRef, useCallback, useState } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types';
import {useParamsContext} from '@/context'

const TableJsx = ({ callback, data, columns, ...props }) => {

  const { setParams } = useParamsContext()
  const table = useRef(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  // 获取动态高度
  const measuredRef = useCallback(node => {
    if (node !== null) {
      const { width, y } = node.getBoundingClientRect();
      console.log(16, node.getBoundingClientRect());
      setWidth(width);
      setHeight(`calc(100vh - ${y + 120}px)`);
    }
  }, []);

  // 事件委托 监听表格内部事件
  useEffect(() => {
    table.current = document.querySelector('#table')
    table.current.addEventListener('click', tableClickImplement, false)

    return () => table.current.removeEventListener('click', tableClickImplement, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tableClickImplement = useCallback((e) => {

    let button = e.target.closest('button')
    if(!button) return;

    if(!table.current.contains(button)) return;

    const action = button.dataset.action
    if(!action) return;

    callback(action, JSON.parse(button.dataset.record))
  }, [callback])

  return (
    <div
      id='table'
      ref={measuredRef}
    >
      <Table
        {...props}
        bordered
        scroll={{ scrollToFirstRowOnChange: true, x: width, y: height }}
        dataSource={data?.data}
        columns={columns}
        pagination={ data?.currentPage ? {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: () => `共${data.total}条`,
          pageSize: Number(data.perPage),
          current: Number(data.currentPage),
          total: Number(data.total),
          size: 'small',
          onShowSizeChange: (current, pageSize) => setParams((prev) => ({...prev, page_size: pageSize})),
          onChange: (current, pageSize) => setParams((prev) => ({...prev, page: current, page_size: pageSize})),
        } : false }
      />
    </div>
  )
}

TableJsx.defaultProps = {
  callback: () => {}
}
TableJsx.propTypes = {
  callback: PropTypes.func
}
export default TableJsx
