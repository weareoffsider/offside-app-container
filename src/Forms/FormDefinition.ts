import {FormState, FormStepState} from "./FormData"
import {AppState, AppActions, AppActor} from '../AppContainer/DataModel'
import {FormError, FormWarning,
        fieldRequired, emailValidate} from './FormValidators'


export default class FormDefinition<
  BusinessData, UIData, BusinessAction, UIAction
> {
  readonly steps: {[key: string]: FormStepDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >}
  readonly stepOrder: Array<string>

  constructor (readonly name: string) {
    this.steps = {}
    this.stepOrder = []
  }

  addStep (stepName: string, step: FormStepDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >) {
    this.steps[stepName] = step
    this.stepOrder.push(stepName)
  }

  getInitState (formType: string, formKey: string): FormState {
    const steps: {[key: string]: FormStepState} = {}
    this.stepOrder.forEach((stepKey: string) => {
      steps[stepKey] = this.steps[stepKey].getInitState()
    })

    return {
      formType,
      formKey,
      steps,
    }
  }
}


export class FormStepDefinition<
  BusinessData, UIData, BusinessAction, UIAction
> {
  readonly fields: {[key: string]: FormFieldDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >}
  readonly fieldOrder: Array<string>

  constructor (readonly name: string) {
    this.fields = {}
    this.fieldOrder = []
  }

  addField (fieldName: string, field: FormFieldDefinition<
    BusinessData, UIData, BusinessAction, UIAction
  >) {
    this.fields[fieldName] = field
    this.fieldOrder.push(fieldName)
  }

  getInitState (): FormStepState {
    const stepState: FormStepState = {
      data: {},
      errors: {},
      warnings: {},
    }

    this.fieldOrder.forEach((fieldKey: string) => {
      stepState.data[fieldKey] = undefined
      stepState.errors[fieldKey] = []
      stepState.warnings[fieldKey] = []
    })

    return stepState
  }
}


export enum FormValidationStyle {
  WhileEditing,
  OnBlur,
  OnStepEnd,
}


export class FormFieldDefinition<
  BusinessData, UIData, BusinessAction, UIAction
> {
  readonly validators: Array<(
    value: any,
    appState: AppState<BusinessData, UIData>,
    appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>
  ) => Promise<boolean>>

  constructor (
    readonly fieldType: string,
    readonly required: boolean = true,
    readonly validationStyle: FormValidationStyle = FormValidationStyle.OnStepEnd,
  ) {
    this.validators = []

    if (required) {
      this.validators.push(fieldRequired)
    }

    if (fieldType === 'email') {
      this.validators.push(emailValidate)
    }
  }
}
