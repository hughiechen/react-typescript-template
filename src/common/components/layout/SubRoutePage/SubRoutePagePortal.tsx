import * as React from 'react'
import ReactDOM from 'react-dom'
import { Context } from './Context'
import PageCard from '../PageCard'

export interface SubRoutePagePortalProps {
  location: 'right' | 'footer'
}

export const SubRoutePagePortal: React.FC<SubRoutePagePortalProps> = React.memo(props => {
  const context = React.useContext(Context)
  const parentPageCard = context.getParentPageCard()
  const containerClassName = props.location === 'right' ? PageCard.classNames.header : PageCard.classNames.body
  const children = <div className={props.location === 'right' ? PageCard.classNames.headerRight : PageCard.classNames.footer}>{props.children}</div>
  return context.isMount ? ReactDOM.createPortal(children, parentPageCard!.querySelector(`.${containerClassName}`)!) : null
})
