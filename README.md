

# Wue

## What is Wue?

**Wue是一个加强Vue数据管理的解决方案，采用了分布式思想，提升了vue开发过程中数据的灵活性和唯一性**

## Wue能带来什么？

1. __wue为组件增加了对外暴露公共data和methods的能力__ ----- 暴露出来的属性（__data和__method），让其他组价来调用和访问、甚至是修改。

2. __全新的组件通信方式，带来全新的编码体验__----- 接入wue，任何组件之间都不需要props以及中央数据总线的方式来完成间接通信，只需要调用wue api，就能完成跨组件通信和方法调用

3. __全无侵入__ ----- wue不会影响你之前使用vue的习惯，当你想用的wue的时候，就去用

4. __api即配即用，对接yapi__ ----- wue，集成了axios库，只需通过简单的api配置，即可直接在Wue代码里调用，无需在组件里显式引用和注入

5. 为了开发遍历，wue提供了Global.gl.js为全局变量，供所有组件使用，这是Wue唯一一份中心化的数据。**

## Usage

### 首先要说明的：

1. Wue本质上并没有改变vue的核心代码，它是一个语法糖，帮助开发者做了一些事情而已。

2. 一个组件，如果想使用wue的api来帮自己访问其他组件会被其他组件访问，直接在vue的配置里增加__data和__methods就可以完成

3. 一个已经交给wue托管了的组件，如果想按照传统的方式传值给子组件，直接按照原来的方式写就可以了。也就是说，wue不会影响你之前使用vue的习惯，当你想用的wue的时候，就去用。


### 配置Wue
简单配置，即刻拥有Wue的所有能力

```javascript
import Vue from 'Vue';
import index from './index.vue'

// 引入vue增强插件
import Wue from 'wue';

Vue.use(Wue, {
  dir: require.context('./components')
})

new Vue({
  el: '#app',
  render: h => h(index)
})

```

## API

### __get

**功能说明** 访问其他组件的data的时候，使用：

```javascript
this.__get('组件文件名.变量名')
```

### __set

**功能说明** 更改其他组件的数据的时候，使用

```javascript
this.__set('组件文件名.变量名')
```

### __emit

**功能说明** 触发其他组件的公有方法的时候，使用

```javascript
this.__emit('组件文件名.方法名')
```

### __api

api只要按照如下配置，就可以在所有组件里直接通过 this.__api[api名]使用

```javascript
export default [
  {
    api: 'getCityList',
    type: 'get',
    url: `api/citylist`,
    desc: '查询城市'
  },{
    api: 'updateCity',
    type: 'post',
    url: `api/update`,
    desc: '城市信息修改' 
  }
]

```
在Wue中，任何地方都可以调用以下代码调用API,而不需要引入

```javascript
this.__api.getCityList({q: this.cityId}, (data) => {
  this.__set('list.data.dList', data)
})
```


### DEMO

使用一个简单的姓名输入功能来演示wue的api

api配置、全局数据及入口配置

```javascript
// Global.gl.js
export default {
  auth: false
}

// api.js
export default [
  {
    api: 'auth',
    type: 'get',
    url: `api/auth`,
    desc: '鉴权接口'
  },{
    api: 'save',
    type: 'post',
    url: `api/save`,
    desc: '姓名保存' 
  },
  {
    api: 'valid',
    type: 'post',
    url: `api/valid`,
    desc: '校验姓名是否重复' 
  }
]

// index.js
import Vue from 'Vue';
import index from './index.vue'
import Wue from 'wue';

Vue.use(Wue, {
  dir: require.context('./components')
})

new Vue({
  el: '#app',
  render: h => h(index)
})
``` 

三个组件需要使用wue通信的组件

```js
// index.vue 
<template>
  <div class="pro-module">
    <name-input/> <!--名称输入-->
    <name-duplicheck/> <!--输入重复性校验-->
  </div>
</template>
<script>
 export default {
    name: 'name-index',
    created () {
      // 鉴权接口调用
      this.__api.auth('page/name', (data) => {
        // 设置全局为全局
        this.__set('Global.auth', data['page/name'])
      })
    }
  }
</script>
```

```js
// NameInput.vue
<template>
  <div class="pro-module">
    <div v-if="__get('Global.auth')">
      <input type="text" v-model="name">
      <button type="primary" @click="save">直接保存</button>
    </div>
    <div v-else>对不起，您没有录入权限</div>
  </div>
</template>
<script>
 export default {
    name: 'name-input',
    __data () {
      return {
        name: ''
      }
    },
    __methods: {
      save () {
        this.__api.save({
          name: this.name
        })
      }
    }
  }
</script>
```

```js

// NameDupliCheck.vue
<template>
  <div class="pro-module">
    <label>已输入姓名：{{__get('NameInput.name')}}</label>
    <label>校验结果：{{result}}</label>
    <button type="primary" @click="valid">校验姓名是否存在</button><!--校验姓名是否存在，若不存在，直接调用NameInput的save保存-->
  </div>
</template>
<script>
 export default {
    name: 'name-duplicheck',
    data () {
      return {
        result: ''
      }
    },
    methods: {
      valid () {
        this.__api.valid({
          name: __get('NameInput.name'
        }, (data) => {
          if (data) {
            this.__emit('NameInput.save')
            return 
          } else {
            this.result = '姓名已存在'
          }
        })
      }
    }
  }
</script>
```

