export interface FormStepState {
  data: {[key: string]: any}
  errors: {[key: string]: Array<string>}
  warnings: {[key: string]: Array<string>}
}


export interface FormState {
  // formType: string
  // formKey: string
  currentStep: string
  complete: boolean
  steps: {[key: string]: FormStepState}
}
