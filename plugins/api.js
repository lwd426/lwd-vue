import axios from './http';

function jsonFormData(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  return formData;
}
export default {
  headers: {},
  _getParams(url, params) {
    // 读取headers判断该接口是否被用户定义请求头
    if (!params) params = {}
    const headers = this.headers[url]
    let options = [url]
    try {
      if (headers && Object.keys(headers).length > 0) {
        options.push({
          headers
        })
        // 如果是formdata类型，要转换成FormData
        if (headers['Content-Type'] && headers['Content-Type'].toLowerCase() === 'multipart/form-data' && Object.prototype.toString.call(params) !== '[object FormData]') {
          params = jsonFormData(params)
        }
      }
      options.splice(1, 0, params)
    } catch (e) {
      console.log(`wue配置错误:api.js内 ${url} headers 参数有误~`)
    }

    return options
  },
  get2(url, params, res_type, handler, err_f) {
    let sparams = ''

    if (params && Object.prototype.toString.call(params) === '[object Object]') {
      let usparams = new URLSearchParams()
      for (let key in params) {
        usparams.append(key, params[key])
      }
      sparams = usparams.toString()
    }
    if (sparams) url += '?' + sparams
    axios.get(url).then(res => {
      if (res_type === 'original') {
        handler && handler(res)
        return false
      }
      // 如果res没有code字段，则直接返回res对象
      if (!res.hasOwnProperty("code")) {
        handler && handler(res)
        return false
      }
      if (res.code === 0) {
        handler && handler(res.data)
      } else {
        err_f && err_f(res.msg)
      }
    }).catch(err => {
      err_f && err_f(err)
    })
  },
  get(url, params, res_type, handler, err_f) {
    axios.get(...this._getParams(url, {
      params
    })).then(res => {
      if (res_type === 'original') {
        handler && handler(res)
        return false
      }
      // 如果res没有code字段，则直接返回res对象
      if (!res.hasOwnProperty("code")) {
        handler && handler(res)
        return false
      }
      if (res.code === 0) {
        handler && handler(res.data)
      } else {
        err_f && err_f(res.msg)
      }
    }).catch(err => {
      console.log(err)
      err_f && err_f(err)
    })
  },
  post(url, params, res_type, handler, err_f) {
    axios.post(...this._getParams(url, params)).then(res => {
      if (res_type === 'original') {
        handler && handler(res)
        return false
      }
      // 如果res没有code字段，则直接返回res对象
      if (!res.hasOwnProperty("code")) {
        handler && handler(res)
        return false
      }
      if (res.code === 0) {
        handler && handler(res.data)
      } else {
        err_f && err_f(res.msg)
      }
    }).catch(err => {
      console.log(err)
      err_f && err_f(err)
    })
  },
  apisExcute(urls, mock_type) {
    let ao = {}
    urls.forEach(url => {
      ao[url.api] = (data, res_type, success_f, err_f) => {
        if ((typeof res_type == 'string') && res_type.constructor == String) {
          if (['original', 'data'].indexOf(res_type) === -1) return new Error('响应值类型只能为original或data')
        } else {
          err_f = success_f || undefined
          success_f = res_type
          res_type = 'original'
        }

        !err_f && (err_f = function (err) {
          alert('接口错误' + err)
        })
        let method_type = url.type.toLowerCase() || 'get'
        const urlstr = mock_type === 'apijs' ? url.mock : url.url
        if (url.headers && url.headers.toString() === '[object Object]') {
          this.headers[urlstr] = url.headers;
        }
        this[method_type](urlstr, data, res_type, success_f, err_f)
      }
    })
    return ao || {}
  }
}
