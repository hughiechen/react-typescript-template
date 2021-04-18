/*
 * @Author: yang
 * @Date: 2019-11-01 16:33:13
 * @Last Modified by: sheng
 * @Last Modified time: 2021-02-03 10:24:47
 * 公共输入搜索框
 */

import React from 'react'
import classnames from 'classnames'
import { Button } from 'antd'
import { Input } from '../../basic/Input'
import { InputSearch } from '../../basic/Input/InputSearch'
import type { InputSearchProps } from '../../basic/Input/InputSearch'
import styles from './index.module.less'
import { ButtonType } from 'antd/lib/button'

// NOTE: allowClear 属性造成 Input.Search 存在两层的完全相同的容器，通过外部 className 设置样式会造成布局问题，这是 Antd 的问题。后续根据 Antd 更新情况，删除下面 div 的包裹

type HandleSearchEvent = React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>

export interface ISearchProps extends InputSearchProps {
  buttonType?: ButtonType
  buttonText?: string
  onScan?: (value: string, event?: HandleSearchEvent) => void
}

export const SearchInput = React.forwardRef<InputSearch, ISearchProps>((props, ref) => {
  const { className, style, buttonText = intl.get('operate_search_for'), buttonType, onSearch, onScan, ...restProps } = props

  const handleSearch = React.useCallback(
    (v: string, e?: HandleSearchEvent) => {
      const hasPrefix = v?.match(/SN(:|：)/)
      if (hasPrefix) {
        const value = v?.match(/[0-9]+/)?.[0]
        onScan?.(value!, e)
      } else if (v?.match(/(MB|mb)(:|：)/)) {
        const value = v?.match(/[0-9]+/)?.[0]
        onScan?.(value!, e)
      } else {
        onSearch?.(v, e)
      }
    },
    [onSearch, onScan]
  )

  return (
    <div style={style} className={classnames(styles.searInput, className)}>
      <Input.Search
        {...restProps}
        ref={ref}
        allowClear
        enterButton={
          <Button data-testid="searchBt" type={buttonType}>
            {buttonText}
          </Button>
        }
        onSearch={handleSearch}
      />
    </div>
  )
})

// SearchInput.defaultProps = {
//   buttonText: intl.get('operate_search_for'),
// }

export default SearchInput
