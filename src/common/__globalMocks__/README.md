<!--
 * @Author: Hughie
 * @Date: 2020-06-20 13:55:17
 * @LastEditTime: 2021-04-18 17:40:37
 * @LastEditors: Hughie
 * @Description:
-->

# globalMocks 文件个使用说明

- globalMocks 主要放一下通用的全局 mock

## 注意

- **mocks** 下不要放置和 node_module 相同名称的 模块，否则 jest 会自动把对应的 node_module 的依赖都 mock 成**mocks**下的模块
- 如果需要 mock 和 node_module 同名的模块 比如 history，请把相关的需要 mock 的模块放在这文件，然后再单元测试的文件中主动调用 jest.mock('@/common/history') 来完成 mock 自己使用

```
jest.mock('@/common/history',()=>{
  ...
})
```

来 mock
