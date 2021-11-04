import DynamicTable from 'components/table'
import { columns } from '@/pages/goods/config'
import { useCallback } from 'react'
import { useUpdateMutation, useDeleteMutation } from '@/libs/hooks'
import {goodsDelete, goodsOffShelf, goodsPublish} from '@/libs/api/goods-api'
import { deleteModel } from "@/libs/utils/deleteModel";

const TableJsx = ({ params, queryKey, ...resetProps }) => {
  const { mutate: deleteHandler } = useDeleteMutation({
    queryKey,
    api: goodsDelete,
    dependencies: params,
    itemKey: 'goodsId'
  });

  const { mutate: publishHandler } = useUpdateMutation({
    queryKey,
    api: goodsPublish,
    dependencies: params,
    itemKey: 'id'
  });

  const { mutate: offShelf } = useUpdateMutation({
    queryKey,
    api: goodsOffShelf,
    dependencies: params,
    itemKey: 'id'
  })

  const editorAction = (params) => {
    console.log(params)
  }

  const upDown = (params) => {
    const { onSale, goodsId } = params;
    let paramsObj = {
      goods_id: goodsId,
      onSale: onSale === '3' ? '2' : '3'
    }
    if(onSale === '3') {
      publishHandler(paramsObj)
    } else {
      offShelf(paramsObj)
    }
  }

  const deleteAction = (params) => {
    const { goodsId } = params
    deleteModel(deleteHandler.bind(null, { goods_id: goodsId }))
  }

  const callback = useCallback((type, data) => {
    switch (type) {
      case 'upDown':
        upDown(data);
        break;
      case 'editor':
        editorAction(data);
        break;
      case 'delete':
        deleteAction(data);
        break;
      default:
        break;
    }
  }, [])

  return (
   <DynamicTable
     {...resetProps}
     callback={callback}
     columns={columns}
   />
  )
}

export default TableJsx
