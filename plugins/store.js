
export default (config, vue) => {
  let BUS = new vue()
  // onData属性为逻辑总线中的所有实例中注册的监听事件
  BUS.onData = {}
  // ovues属性为所有块的vue实例集合
  BUS.ovues = {}
  BUS.keyVues = {}
  // 块 在created时要注册自己的实例在逻辑总线中
  vue.prototype.__register = (k, v) => {
    BUS.ovues[k] = v
  }
  if (config.Global) {
    let global = new vue()
    const data = config.Global.default ? config.Global.default : config.Global
    for (var key in data) {
      global[key] = data[key] || ''
      BUS.onData['Global.' + key] = data[key] || ''
    }
    BUS.ovues.Global = global
  }
  // 获取bus中数据
  vue.prototype.__get = function (key) {
    const shili = BUS.ovues[key.split('.')[0]]
    // 在此key的影响vue实例链中增加此实例
    if (!BUS.keyVues[key]) BUS.keyVues[key] = []
    BUS.keyVues[key].push(this)

    // 返回vue实例key的值
    return shili[key.split('.')[1]] || null
  }

  vue.prototype.__set = function () {
    const key = arguments[0]
    if (!key || Object.keys(BUS.onData).indexOf(key) == -1) return
    const shili = BUS.ovues[key.split('.')[0]]
    Array.prototype.shift.apply(arguments)
    shili[key.split('.')[1]] = arguments[0]

    // 更新所有跟此key绑定的vue实例
    BUS.keyVues[key] && BUS.keyVues[key].map(v => v.$forceUpdate())
  }

  vue.prototype.__emit = function () {
    const key = arguments[0]
    if (!key || Object.keys(BUS.onData).indexOf(key) == -1) return
    const shili = BUS.ovues[key.split('.')[0]]
    Array.prototype.shift.apply(arguments)
    return BUS.onData[key].apply(shili, arguments)
  }
  // 所有的块中的methods事件都要加入逻辑总线的监听中
  for (var key in config) {
    const comp_name = key
    const methods = config[key].methods // 绑定事件监听
    const datas = config[key].data // 处理所有data
    for (var key in methods) {
      BUS.onData[comp_name + '.' + key] = methods[key] || function () {}
    }
    for (var key in datas) {
      BUS.onData[comp_name + '.' + key] = datas[key] || ''
    }
  }
  return BUS
}