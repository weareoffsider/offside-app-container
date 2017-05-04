import {FormState} from './FormData'
import FormDefinition, {FormValidationStyle} from "./FormDefinition"
import {AppState, AppActor} from "../AppContainer/DataModel"
import {cloneDeep} from "lodash"

export interface FormActions {
  init: (formType: string, formKey?: string) => void
  updateField: (stepKey: string, fieldKey: string, value: any) => void
  blurField: (stepKey: string, fieldKey: string) => void
  validateField: (stepKey: string, fieldKey: string) => Promise<boolean>
  submitStep: (stepKey: string) => Promise<boolean>
}

export default class FormInstance<ValidationData> {
  constructor (
    public formDefinition: FormDefinition,
    public validationData: ValidationData,
    public onUpdate: (formData: any) => void
  ) {
    this.formData = formDefinition.getInitState()
    console.log(this.formData)
  }

  updateFormState (newData: any) {
    this.formData = newData
    this.onUpdate(newData)
  }

  updateValidationData (valData: ValidationData) {
    this.validationData = valData
  }

  updateField (stepKey: string, fieldKey: string, value: any) {
    const formState = cloneDeep(this.formData)
    const form = this.formDefinition
    const field = form.steps[stepKey].fields[fieldKey]

    formState.steps[stepKey].data[fieldKey] = value
    this.updateFormState(formState)

    if (field.validationStyle === FormValidationStyle.WhileEditing) {
      this.validateField(stepKey, fieldKey)
    }
  }

  blurField (stepKey: string, fieldKey: string) {
    const formState = cloneDeep(this.formData)
    const form = this.formDefinition
    const field = form.steps[stepKey].fields[fieldKey]

    if (field.validationStyle === FormValidationStyle.OnBlur ||
        field.validationStyle === FormValidationStyle.WhileEditing) {
      this.validateField(stepKey, fieldKey)
    }
  }

  validateField (stepKey: string, fieldKey: string): Promise<boolean> {
    const startState = cloneDeep(this.formData)
    const form = this.formDefinition
    const field = form.steps[stepKey].fields[fieldKey]
    const value = startState.steps[stepKey].data[fieldKey]

    console.log(`FormInstance :: validating ${stepKey}.${fieldKey}:`, value)

    return Promise.all(field.validators.map((validator) => {
      return validator(value, startState, this.validationData)
    })).then((results) => {
      const formState = cloneDeep(this.formData)
      formState.steps[stepKey].errors[fieldKey] = []
      formState.steps[stepKey].warnings[fieldKey] = []
      this.updateFormState(formState)
      return true
    }, (error) => {
      const formState = cloneDeep(this.formData)

      if (error.name === "FormError") {
        formState.steps[stepKey].errors[fieldKey] = [error.message]
      } else if (error.name === "FormWarning") {
        formState.steps[stepKey].warnings[fieldKey] = [error.message]
      }
      this.updateFormState(formState)

      return error
    })
  }

  submitStep (stepKey: string): Promise<boolean> {
    const formState = cloneDeep(this.formData)
    const form = this.formDefinition
    const fieldKeys = Object.keys(form.steps[stepKey].fields)

    return Promise.all(fieldKeys.map((fieldKey) => {
      return this.validateField(stepKey, fieldKey)
    })).then((results: any) =>  {
      const formState = cloneDeep(this.formData)

      if (results.every((r: any) => r === true)) {
        const currentIx = form.stepOrder.indexOf(formState.currentStep);
        if (currentIx < form.stepOrder.length - 1) {
          formState.currentStep = form.stepOrder[currentIx + 1]
        } else {
          formState.complete = true
        }

        this.updateFormState(formState)

        return Promise.resolve(formState)
      } else {
        return Promise.reject(formState.steps[stepKey].errors)
      }
    })
  }

}
