import {FormState, FormStepState} from "./FormData"


export default class FormDefinition {
  readonly steps: {[key: string]: FormStepDefinition}
  readonly stepOrder: Array<string>

  constructor (readonly name: string) {
    this.steps = {}
    this.stepOrder = []
  }

  addStep (stepName: string, step: FormStepDefinition) {
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


export class FormStepDefinition {
  readonly fields: {[key: string]: FormFieldDefinition}
  readonly fieldOrder: Array<string>

  constructor (readonly name: string) {
    this.fields = {}
    this.fieldOrder = []
  }

  addField (fieldName: string, field: FormFieldDefinition) {
    this.fields[fieldName] = field
    this.fieldOrder.push(fieldName)
  }

  getInitState (): FormStepState {
    const stepState: FormStepState = {
      data: {},
      errors: {},
    }

    this.fieldOrder.forEach((fieldKey: string) => {
      stepState.data[fieldKey] = undefined
      stepState.errors[fieldKey] = []
    })

    return stepState
  }
}


export class FormFieldDefinition {
  constructor (
    public fieldType: string
  ) {
  }
}
