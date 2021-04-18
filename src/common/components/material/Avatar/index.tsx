/**
 * 头像组件，适用于患者与医生
 */

import React from 'react'

export enum GenderEnum {
  'MALE' = 1,
  'FEMALE' = 2,
  'UNKNOWN' = 3,
}

export interface AvatarProps {
  sex: 'male' | 'female' | 'unknown' | GenderEnum
  size?: number
  type?: 'doctor' | 'patient'
  src?: string
  className?: string
  style?: React.CSSProperties
}

export class Avatar extends React.PureComponent<AvatarProps> {
  static defaultProps: PickOptional<AvatarProps> = {
    type: 'patient',
  }

  private readonly resourceData = {
    doctor: {
      src: {
        male: require('./img/doctor-male.png'),
        female: require('./img/doctor-female.png'),
        unknown: require('./img/doctor-unknown.png'),
      },
      defaultSize: 40,
    },
    patient: {
      src: {
        male: require('./img/male.png'),
        female: require('./img/female.png'),
        unknown: require('./img/unknown.png'),
      },
      defaultSize: 100,
    },
  }

  getImgInfo = () => {
    const { sex, type, src } = this.props
    const defaultSize = this.resourceData[type!].defaultSize
    if (src) {
      return { src, defaultSize }
    }
    if (sex === 'male' || sex === GenderEnum.MALE) {
      return { src: this.resourceData[type!].src.male, defaultSize }
    }
    if (sex === 'female' || sex === GenderEnum.FEMALE) {
      return { src: this.resourceData[type!].src.female, defaultSize }
    }
    return { src: this.resourceData[type!].src.unknown, defaultSize }
  }

  render() {
    const { size, className, style } = this.props
    const { src, defaultSize } = this.getImgInfo()
    return <img className={className} style={{ height: size || defaultSize, width: size || defaultSize, ...style }} src={src} alt="头像" />
  }
}

export default Avatar
