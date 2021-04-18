<!--
 * @Author: Hughie
 * @Date: 2020-06-18 09:37:14
 * @LastEditTime: 2020-06-18 10:21:14
 * @LastEditors: Hughie
 * @Description:
-->

### 说明

#### 功能

- 用于页面间的状态保存，只作为路由保存刷新后页面缓存失效

#### 概念

- 缓存上下文：hStack 抽象了一个概念，它表示的是在当前 history 状态下对应的缓存对象。
- HStack.contextCache： 缓存上下文和路由相关（排除 replace），每次 push 的时候 会把当前 contextCache 压栈，goBack 的时候把 之前保存的上下文恢复到 HStack.contextCache 中
- HStack.contextCache 使用了和 localStorage 的接口方式 ，setItem getItem 来设置。

#### 注意事项

- 针对 replace 不做处理，所以在使用 subpage 的页面进行 tab 页切换的时候，各个界面需自己在 unmount 中清除自己相关的缓存，否则状态缓存将会保存下来，在下次 goback 的时候切换 tab 也会想法 HStack.contextCache 会有之前的不该保存的信息

#### 使用方式

```
 1.app.tsx 中
 import {hStack} from 'hStack'
 hStack.hookHistory(history)

 2.A页面 跳转到 B页面
 import {HStack, hStack} from 'hStack'
  HStack.contextCache.setItem('pageA', {
    input: 1,
  })
  HStack.pushPage('/b')

  3. B页面 返回到 A页面，A页面的恢复代码
  construct(){
    const preState = HStack.contextCache.getItem('pageA')
    这里的 preState 就是之前存进去的
    {
        input: 1,
    }
  }
```

#### 和之前 hStack 不一样的地方

- 之前和之前 hStack 使用的是统一缓存管理方式，通过 多个 effect 副作用形成堆栈来维护 统一缓存里面的数据。新的 hStack 使用的栈式管理缓存的方式，缓存的栈和 history 进行某种关系的对应，从而维护多个页面间的缓存。通过全局缓存堆栈和 HStack.contextCache（当前缓存上下文）达到恢复状态的效果。
- 新的状态缓存不再有 key 的概念，所以在同一上下文，可以自由地存放数据（只需要保证 不和别人冲突）。
- HStack.contextCache.setItem 的 key 并非之前 hStack cache 中的缓存的 key，之前的 key 是全局的（也就是说 在 A 页面 cache.save（'A','2'）的 push 了一个 A 页面，那么新 push 出来的 A 页面调用 cahce.get('A')能获取到之前缓存的数据，而新的 HStack.contextCache.getItem('A') 不会产生这种不正常的行为。具体可以参考（
  单元测试：[7 push 同一个 页面，下一页面获取不了上以页面的缓存](./__test__/HStack.test.ts)
  ）

### 解决之前问题的痛点

- 卡片列表方式跳转：卡片是独立的组件，跳转的逻辑是放在 卡片组件代码里面的， （就模式中）如果需要跳转就必须先把状态保存到全局的 cache 中，在跳转的时候再标识这块数据是真正需要缓存的。如果没跳转，就必须在 unmount 的地方 来清除掉这块数据。否则将会导致内存泄漏。 （新模式中）任意地方都可以设置缓存，如果不发生跳转，将会自动清除掉，无需手动清除。
- 解决跳转和缓存耦合严重的问题：新方式中，缓存可以在任意的点发生，无需关心当前 page 的 key 是什么，所以降低了代码的耦合性。跳转和缓存代码无需写在一起，不需要像之前的写法 pushPage（url, stateEffetc）
