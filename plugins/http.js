/**
 * axios http
 * copied by liuweidong04 on 18/09/26
 */

import axios from './axios-0.16.2';

//不需要组件处理的错误code值，此类错误信息需要在代码里单独处理 
const CODE_SPECIAL = []

// axios 配置
// axios.defaults.timeout = 100000
axios.defaults.headers = {
  'X-Requested-with': 'XMLHttpRequest'
}
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

// http response 拦截器
axios.interceptors.response.use(response => {

  const {
    status,
    headers,
    data
  } = response
  // DO STH
  
  return response.data;
}, error => Promise.reject(error))

export default axios
