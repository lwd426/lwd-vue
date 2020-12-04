import cStore from './store'
import core from './core'
import cApi from './api'
const install = (Vue, option) => {
  // 判断有没有被注册
  // 如果注册过，就直接返回，否则就再注册一遍
  if(install.installed) return
  install.installed
  let conf = {}

  option.Global && Object.keys(option.Global).forEach(fileName => {
    const moduleName = fileName.replace(fileName.substring(0, fileName.lastIndexOf('/') + 1), '').replace('.gl.js', '')
    conf[moduleName] = option.Global[fileName].default || option.Global[fileName]
  });
  
  
  // 2. 处理组件实例
  option.Views && Object.keys(option.Views).forEach(component => {
    const moduleName = component.replace(component.substring(0, component.lastIndexOf('/') + 1), '').replace('.vue', '')
    let componentEntity = option.Views[component].default || option.Views[component]
    const vueConstructor = core(moduleName, componentEntity)
    conf[moduleName] = vueConstructor.public
    // 使用内置的组件名称 进行全局组件注册
    Vue.component(componentEntity.name, vueConstructor.all)
  });
  // 注册数据总线
  cStore(conf, Vue)
  // 3. 处理Mock
  option.MockType === 'mockjs' && option.Mock && Object.keys(option.Mock).forEach(component => {
    option.Mock[component].default || option.Mock[component]
  });

  // 4. 处理Api
  option.Apis && Object.keys(option.Apis).forEach(component => {
    let apiEntity = option.Apis[component].default || option.Apis[component]
    Vue.prototype.__api = cApi.apisExcute(apiEntity, option.MockType)
  });
}

// 确保是正常环境
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
}