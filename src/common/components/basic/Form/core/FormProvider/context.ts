import React from 'react'
import { FormManager } from './FormManager'

export const FormContext = React.createContext<FormManager<any> | null>(null)
