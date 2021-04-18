import * as React from 'react'
import { GridLayout } from '../../layout/GridLayout'
import styles from './index.module.less'

export class TableSearchBar extends React.PureComponent {
  static Left: React.FC = React.memo(props => (
    <div className={styles.left}>
      {React.Children.map(props.children, (children, index) => {
        return children && <div key={index}>{children}</div>
      })}
    </div>
  ))

  static Right: React.FC = React.memo(props => (
    <div className={styles.right}>
      {React.Children.map(props.children, (children, index) => {
        return children && <div key={index}>{children}</div>
      })}
    </div>
  ))

  render() {
    return (
      <GridLayout column={['auto', 'auto']} className={styles.container}>
        {this.props.children}
      </GridLayout>
    )
  }
}

export default TableSearchBar
