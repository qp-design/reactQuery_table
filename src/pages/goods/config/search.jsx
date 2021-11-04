/**
 * 查询字段
 * @type {*[]}
 */
export const fieldsData = [
  {
    type: 'select',
    name: 'searchType',
    initialValue: 'goodsCode',
    optionKey: 'key',
    optionName: 'name',
    placeholder: '请输入',
    options: [{
      key: 'goodsCode',
      name: '商品编码'
    }, {
      key: 'goodsId',
      name: '商品ID'
    },{
      key: 'supplierCode',
      name: '商家编码'
    }, {
      key: 'goodsName',
      name: '商品标题'
    }],
    props: {
      style: { width: 120 },
    },
    callback: (e, callback) => {
      callback({
        searchTypeValue: '',
      })
    }
  },
  {
    type: 'text',
    name: 'searchTypeValue',
    initialValue: '',
    placeholder: '请输入值',
    props: {
      style: { width: 120 }
    }
  },
  {
    type: 'select',
    name: 'onSale',
    initialValue: '2',
    placeholder: '商品售卖状态',
    options: [{
      key: '0',
      name: '已发布'
    }, {
      key: '1',
      name: '待上架'
    }, {
      key: '2',
      name: '售卖中'
    }, {
      key: '3',
      name: '仓库中'
    }],
    props: {
      style: { width: 120 }
    }
  },
  {
    type: 'select',
    name: 'searchDateTimeType',
    initialValue: '1',
    placeholder: '请选择时间类型',
    options: [{
      key: '1',
      name: '创建时间'
    }, {
      key: '2',
      name: '首次上架时间'
    }],
    props: {
      style: { width: 150 }
    },
  },
];
