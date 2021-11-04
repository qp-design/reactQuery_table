import DynamicTable from 'components/table'
import { columns } from '@/pages/goods/config'
import { useCallback } from 'react'
import { useUpdateMutation, useDeleteMutation } from '@/libs/hooks'
import {goodsDelete, goodsOffShelf, goodsPublish} from '@/libs/api/goods-api'
import { deleteModel } from "@/libs/utils/deleteModel";
import drawerJsx from "@/libs/utils/drawerJsx";
import diaglogJsx from "@/libs/utils/dialogJsx";
import Demo from "../demo";

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
    drawerJsx(Demo, {
      drawerConfig: {
        title: 'XXXXX'
      },
      restsProps: {

      }
    })
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
