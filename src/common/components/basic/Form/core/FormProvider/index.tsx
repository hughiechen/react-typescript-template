import * as React from 'react'
import { FormManager, Forms } from './FormManager'
import { FormContext } from './context'

export interface FormProviderProps<F extends Forms> {
  formsManager?: FormManager<F>
  onFormChange?: (formName: keyof F, fieldName: string, forms: F) => void
}

export class FormProvider<F extends Forms> extends React.PureComponent<FormProviderProps<F>> {
  private contextState

  constructor(props: FormProviderProps<F>) {
    super(props)
    const formManager = this.props.formsManager ?? new FormManager<F>()
    formManager.onFormChange = this.props.onFormChange
    this.contextState = formManager
  }

  get forms() {
    return this.contextState.forms
  }

  render() {
    return <FormContext.Provider value={this.contextState}>{this.props.children}</FormContext.Provider>
  }
}
