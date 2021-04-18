declare type PickField<T, K extends keyof T> = K extends string ? Record<K, T[K]> : never
