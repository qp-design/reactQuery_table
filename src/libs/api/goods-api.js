// 商品模块

import xhrFactory from './config/config';

// 商品列表查询
export const goodsQuery = xhrFactory({
  url: '/goods/list',
  method: 'GET'
});

// 商品删除
export const goodsDelete = xhrFactory({
  url: '/goods/delete',
  method: 'POST',
  contextType: 'application/x-www-form-urlencoded'
});

// 商品上架
export const goodsPublish = xhrFactory({
  url: '/goods/publish',
  method: 'POST',
});

// 商品下架
export const goodsOffShelf = xhrFactory({
  url: '/goods/off_shelf',
  method: 'POST',
});
