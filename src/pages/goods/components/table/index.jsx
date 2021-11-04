import {Spin} from 'antd'
import TableJsx from './tableJsx'
import {useParamsContext} from '@/context'
import {useListQuery} from '@/libs/hooks'
import {goodsQuery} from '@/libs/api/goods-api'

export default function Index() {
  const { params } = useParamsContext();
  const { data, isLoading } = useListQuery({
    queryKey: 'goods',
    api: goodsQuery
  }, params)
  return (
    <Spin
      spinning={isLoading}
    >
      <TableJsx
        params={params}
        queryKey={'goods'}
        rowKey={'goodsId'}
        data={data}
      />
    </Spin>
  )
}
