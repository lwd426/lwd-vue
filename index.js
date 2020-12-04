import ins from './plugins/index'
let public_context = {}
let api_context = {}
let views_context = {}
let mock_context = {}
let global_context = {}

export default {
  install(vue, option) {
    if (!option || !option.dir) return new Error('请设置wue作用路径')
    const context = option.dir
    const isMock = option.mock || false
    let mockType = 'mockjs'
    context && context.keys().forEach(fileName => {
      if (/\.w\.js$/.test(fileName)) {
        public_context[fileName] = context(fileName)
      } else if (/\.vue$/.test(fileName)) {
        views_context[fileName] = context(fileName)
      } else if (/\.gl\.js$/.test(fileName)) {
        global_context[fileName] = context(fileName)
      } else if (/api\.js$/.test(fileName)) {
        api_context[fileName] = context(fileName)
        isMock && (mockType = 'apijs')
      // } else if (/api\.mock\.js$/.test(fileName)) {
      //   mockType = 'apijs'
      //   api_context[fileName] = context(fileName)
      } else if (/\.mock\.js$/.test(fileName)) {
        mock_context[fileName] = context(fileName)
      }
    })

    ins.install(vue, {
      Global: global_context,
      Models: public_context,
      Views: views_context,
      Apis: api_context,
      MockType: mockType,
      Mock: mock_context
    })
  }
}
