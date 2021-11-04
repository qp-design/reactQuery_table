import fetchImplement from '../../http';
import { defaultPath } from './common'
import qs from 'qs'
const xhrFactory = ({ url, method = 'GET', contextType = 'application/json', responseType }) =>
  (params = {}, signal) => {
  let appendPath = '';
  const config = {
    signal,
    method,
    headers: {
      'Content-Type': contextType,
    },
    responseType, // --设置请求数据格式
  };

  if(method === 'GET') {
    appendPath += `?${qs.stringify(params)}`;
  } else if(contextType === 'application/x-www-form-urlencoded') {
    config.body = qs.stringify(params);
  } else {
    config.body = JSON.stringify(params);
  }
  return fetchImplement(defaultPath + url + appendPath, config)
};

export default xhrFactory;
