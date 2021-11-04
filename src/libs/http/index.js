import { message } from "antd";

export default function fetchImplement(url, config) {
  return new Promise(function (resolve, reject) {
    fetch(url, config)
      .then(async(response) => {
        if(response.status === 401) {
          // 没有登录
          reject({ message: "请重新登录" });
        }
        const data = await response.json();
        if(data.code === '0') {
          resolve(data.data)
        } else {
          throw new Error(data.msg)
        }
      }).catch(error => {
        message.warning(error.message);
        reject(error)
      })
  })
}
