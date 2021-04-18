<!--
 * @Author: Hughie
 * @Date: 2020-06-28 15:42:20
 * @LastEditTime: 2020-06-28 15:43:32
 * @LastEditors: Hughie
 * @Description:
-->

# 加载页

## 使用场景

- 一般用于拆包后加载资源时候的 loading

## 例子

```
        <Suspense fallback={<PageLoading fullScreen />}>
                    {RouteItem({
                      key: id,
                      ...route,
                    })}
                  </Suspense>
```
