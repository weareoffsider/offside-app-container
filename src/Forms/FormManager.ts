import {FormState} from './FormData'
import FormDefinition, {FormValidationStyle} from "./FormDefinition"
import {AppState, AppActor} from "../AppContainer/DataModel"
import {cloneDeep} from "lodash"

export interface FormActions {
  init: (formType: string, formKey?: string) => void
  updateField: (formKey: string, stepKey: string, fieldKey: string, value: any) => void
  blurField: (formKey: string, stepKey: string, fieldKey: string) => void
  validateField: (formKey: string, stepKey: string, fieldKey: string) => Promise<boolean>
  submitStep: (formKey: string, stepKey: string) => Promise<boolean>
}

export default class FormManager<
  BusinessData, UIData, BusinessAction, UIAction
> {
  private formRegistry: {[key: string]: FormDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >}
  public getAppState: () => AppState<BusinessData, UIData>
  public getAppActor: () => AppActor<BusinessData, UIData, BusinessAction, UIAction>
  public updateFormState: (newForm: any) => void

  constructor () {
    this.formRegistry = {}
  }

  setStateGetter(func: () => AppState<BusinessData, UIData>) {
    this.getAppState = func
  }

  setActorGetter(func: () => AppActor<BusinessData, UIData, BusinessAction, UIAction>) {
    this.getAppActor = func
  }

  setStateUpdater(func: (newForm: any) => void) {
    this.updateFormState = func
  }

  addForm (form: FormDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >) {
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
    const field = form.steps[stepKey].fields[fieldKey]

    formState.steps[stepKey].data[fieldKey] = value
    newForms[formKey] = formState

    this.updateFormState(newForms)

    if (field.validationStyle === FormValidationStyle.WhileEditing) {
      this.validateField(formKey, stepKey, fieldKey)
    }
  }

  blurField (formKey: string, stepKey: string, fieldKey: string) {
    const newForms = this.readyNewState()
    const formState = cloneDeep(newForms[formKey])
    const form = this.formRegistry[formState.formType]
    const field = form.steps[stepKey].fields[fieldKey]

    if (field.validationStyle === FormValidationStyle.OnBlur ||
        field.validationStyle === FormValidationStyle.WhileEditing) {
      this.validateField(formKey, stepKey, fieldKey)
    }
  }

  validateField (formKey: string, stepKey: string, fieldKey: string): Promise<boolean> {
    const startState = this.readyNewState()[formKey]
    const form = this.formRegistry[startState.formType]
    const field = form.steps[stepKey].fields[fieldKey]
    const value = startState.steps[stepKey].data[fieldKey]
    const appState = this.getAppState()
    const appActor = this.getAppActor()

    console.log(`FormManager :: validating ${formKey}.${stepKey}.${fieldKey}:`, value)

    return Promise.all(field.validators.map((validator) => {
      return validator(value, startState, appState, appActor)
    })).then((results) => {
      const newForms = this.readyNewState()
      const formState = cloneDeep(newForms[formKey])
      formState.steps[stepKey].errors[fieldKey] = []
      formState.steps[stepKey].warnings[fieldKey] = []
      newForms[formKey] = formState
      this.updateFormState(newForms)
      return true
    }, (error) => {
      const newForms = this.readyNewState()
      const formState = cloneDeep(newForms[formKey])

      if (error.name === "FormError") {
        formState.steps[stepKey].errors[fieldKey] = [error.message]
        newForms[formKey] = formState
      } else if (error.name === "FormWarning") {
        formState.steps[stepKey].warnings[fieldKey] = [error.message]
        newForms[formKey] = formState
      }
      this.updateFormState(newForms)

      return error
    })
  }

  submitStep (formKey: string, stepKey: string): Promise<boolean> {
    const newForms = this.readyNewState()
    const formState = cloneDeep(newForms[formKey])
    const form = this.formRegistry[formState.formType]
    const fieldKeys = Object.keys(form.steps[stepKey].fields)

    return Promise.all(fieldKeys.map((fieldKey) => {
      return this.validateField(formKey, stepKey, fieldKey)
    })).then((results: any) =>  {
      const newForms = this.readyNewState()
      const formState = cloneDeep(newForms[formKey])

      if (results.every((r: any) => r === true)) {
        const currentIx = form.stepOrder.indexOf(formState.currentStep);
        if (currentIx < form.stepOrder.length - 1) {
          formState.currentStep = form.stepOrder[currentIx + 1]
        } else {
          formState.complete = true
        }

        newForms[formKey] = formState
        this.updateFormState(newForms)

        return Promise.resolve(formState)
      } else {
        return Promise.reject(formState.steps[stepKey].errors)
      }
    })
  }

  actions (): FormActions {
    return {
      init: this.init.bind(this),
      updateField: this.updateField.bind(this),
      blurField: this.blurField.bind(this),
      validateField: this.validateField.bind(this),
      submitStep: this.submitStep.bind(this),
    }
  }
}
