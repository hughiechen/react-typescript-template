/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:58:24
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-09-03 13:37:54
 * @description 缓存数据，并返回唯一引用
 */
import React from 'react'
import { useIsFirstRender } from '../lifecycle'

/**
 * 缓存数据，并返回唯一引用
 * @param data 缓存的数据，可传入函数，将缓存函数返回值
 * @returns [cache, setCache, getCache]: setCache 方法会更新缓存，不会触发组件重渲染, 当更新 cache 后，可以使用 getCache 获取最新的缓存引用
 * @description
 * - React.useRef(getData()), getData 会在组件每次 render 时执行，无法传入函数计算出缓存值
 * - useCache(getData), getData 将在组件第一次 render 时执行
 * - 生成缓存的数据消耗非常大的时候，可以用函数方式，优化性能，如：`const [data] = useCache(() => new Data());`
 */
export function useCache<T>(data: T | (() => T)) {
  const cacheRef = React.useRef<T>()
  const isFirstRender = useIsFirstRender()
  if (isFirstRender) {
    cacheRef.current = data instanceof Function ? data() : data
  }

  const getCache = React.useCallback(() => cacheRef.current as T, [])

  const setCache = React.useCallback((newData: T) => {
    cacheRef.current = newData
  }, [])

  return [cacheRef.current as T, setCache, getCache] as const
}
