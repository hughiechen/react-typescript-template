/*
 * @Author: Hughie
 * @Date: 2019-11-27 23:30:19
 * @Last Modified by: Hughie
 * @Last Modified time: 2019-12-05 17:10:48
 * 表单块，用于表单布局
 */

import React from 'react'
import classnames from 'classnames'
import { GridLayout, GridLayoutProps } from '../../layout/GridLayout'
import { Title, TitleType } from '../../material/Title'
import styles from './index.module.less'

interface FormBlockProps extends GridLayoutProps {
  title?: React.ReactElement | React.ReactText
  titleType?: TitleType
  titleLeft?: React.ReactNode
  titleRight?: React.ReactNode
  borderType?: 'solid' | 'dashed'
  style?: React.CSSProperties
}

export class FormBlock extends React.PureComponent<FormBlockProps> {
  static Item = GridLayout.Item

  static defaultProps: PickOptional<FormBlockProps> = {
    columnGap: 20,
  }

  render() {
    const { title, titleType, titleLeft, titleRight, borderType, style, ...gridLayoutProps } = this.props
    return (
      <div style={style} className={classnames(styles.formBlock, { [styles.solid]: borderType === 'solid', [styles.dashed]: borderType === 'dashed' })}>
        {title &&
          (React.isValidElement(title) ? <div className={styles.title}>{title}</div> : <Title text={title.toString()} type={titleType} right={titleRight} left={titleLeft} className={styles.title} />)}
        <GridLayout {...gridLayoutProps} />
      </div>
    )
  }
}
