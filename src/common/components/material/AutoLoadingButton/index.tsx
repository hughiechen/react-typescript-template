import React from 'react'
import { Button } from 'antd'
import type { ButtonProps } from 'antd/lib/button'
import { useMountedStatus } from '@/common/hooks/lifecycle'

export interface AutoLoadingButtonProps extends ButtonProps {
  /**
   * 返回 Promise 则根据 Promise 状态自动添加 loading 效果
   * @status
   * - pending -> loading
   * - resolve/reject -> 取消 loading
   */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void | Promise<any>
}

export const AutoLoadingButton: React.FC<AutoLoadingButtonProps> = React.memo(props => {
  const isMount = useMountedStatus()
  const [loading, setLoading] = React.useState(false)
  const onClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        setLoading(true)
        return await props.onClick!(event)
      } finally {
        if (isMount.current) {
          setLoading?.(false)
        }
      }
    },
    [isMount, props.onClick]
  )

  return <Button {...props} loading={loading || props.loading} onClick={props.onClick ? onClick : undefined} />
})
