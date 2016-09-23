import {FormState} from './FormData'
import FormDefinition from "./FormDefinition"
import {AppState} from "../AppContainer/DataModel"
import {cloneDeep} from "lodash"

export interface FormActions {
  init: (formType: string, formKey?: string) => void
  updateField: (formKey: string, stepKey: string, fieldKey: string, value: any) => void
}

export default class FormManager<BusinessData, UIData> {
  private formRegistry: {[key: string]: FormDefinition}
  public getAppState: () => AppState<BusinessData, UIData>
  public updateFormState: (newForm: any) => void

  constructor () {
    this.formRegistry = {}
  }

  setStateGetter(func: () => AppState<BusinessData, UIData>) {
    this.getAppState = func
  }

  setStateUpdater(func: (newForm: any) => void) {
    this.updateFormState = func
  }

  addForm (form: FormDefinition) {
    this.formRegistry[form.name] = form
  }

  readyNewState (): {[key: string]: FormState} {
    const {forms} = this.getAppState()
    const newForms: {[key: string]: FormState} = {}

    Object.keys(forms).forEach((key: string) => {
      newForms[key] = forms[key]
    })

    return newForms
  }

  init (formType: string, formKey?: string) {
    const form = this.formRegistry[formType]
    const newForms = this.readyNewState()

    if (!form) {
      throw new Error(`Form named '${formType}' was not found.`)
    }

    const key = formKey || formType

    newForms[key] = form.getInitState(formType, key)

    this.updateFormState(newForms)
  }

  updateField (formKey: string, stepKey: string, fieldKey: string, value: any) {
    const newForms = this.readyNewState()
    const formState = cloneDeep(newForms[formKey])
    const form = this.formRegistry[formState.formType]

    formState.steps[stepKey].data[fieldKey] = value
    newForms[formKey] = formState

    this.updateFormState(newForms)
  }

  actions (): FormActions {
    return {
      init: this.init.bind(this),
      updateField: this.updateField.bind(this),
    }
  }
}
