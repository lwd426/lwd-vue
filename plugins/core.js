  export default (name, vo) => {
    !vo.methods && (vo.methods = {})
    !vo._methods && (vo._methods = {})
    !vo.data && (vo.data = function(){return {}})
    !vo.__data && (vo.__data = function(){return {}})
    return {
      all: Object.assign({}, vo, {
        created() {
          this.__register(name, this)
          vo.created && vo.created()
        },
        methods: Object.assign({}, vo.__methods, vo.methods),
        data() {
          return Object.assign({}, vo.__data(), vo.data())
        }
      }),
      public: {
        methods: vo.__methods,
        data: vo.__data()
      }
    }
  }