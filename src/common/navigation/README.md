# Navigation

> 扩展 `history` 路由跳转的功能，整个应用关于导航相关的操作都应该使用 `navigation`

#### 路由跳转案例

```ts
// 直接跳转
navigation.push('/url')

// 跳转携带 state
navigation.push('/url', { name: 'jack' })

// 跳转携带 query, query 对象会生成 search 字符串，替换原本的 search 字段
history.push({
  pathname: '/url',
  search: '?name=jack&age=20',
})
// vs
navigation.push({
  pathname: 'url',
  query: {
    name: 'jack',
    age: 20,
  },
})

// 同上
navigation.replace({
  pathname: 'url',
  query: {
    name: 'jack',
  },
})

// 前进后退
navigation.go(-1)
navigation.goBack()
navigation.goForward()

// 页面跳转保存数据，详情查看下面章节
navigation.pushKeepCache('/url', query)
```

#### 跳转保存当前路由数据数据

```ts
// 1. 组件加载时获取缓存的数据
const cache = navigation.cache.popItem<Cache>(cacheKey)

// 2. 页面跳转之前存储数据
navigation.cache.setItem(cacheKey, data)
navigation.pushKeepCache('/url', query)

// 3. 组件卸载清除
navigation.cache.removeItem(cacheKey)
```
