import ActionsJsx from "../../../components/actions";
export const columns = [
  {
    key: 'goodsName',
    title: '商品名称',
    dataIndex: 'goodsName',
    align: 'center',
    width: 400,
  },
  {
    key: 'examineStateLabel',
    title: '商品状态',
    dataIndex: 'examineStateLabel',
    align: 'center',
    width: 300,
  },
  {
    key: 'firstOnSale',
    title: '销售时间',
    dataIndex: 'firstOnSale',
    align: 'center',
    width: 300,
  },
  {
    key: 'action',
    title: '操作',
    isExportExclude: true, // 导出时是否剔除该项
    fixed: 'right',
    width: 300,
    dataIndex: 'action',
    render: (text, record) => <ActionsJsx record={record} actions={actions} />
  }
];


const actions = [
  {
    code: 'upDown',
    name: '上下架'
  },
  {
    code: 'editor',
    name: '编辑',
    style: {
      margin: '0 10px 0 10px'
    }
  },
  {
    code: 'delete',
    name: '删除'
  }
]
