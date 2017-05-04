import {FormState} from "./FormData"
import {AppState, AppActions, AppActor} from '../AppContainer/DataModel'

export class FormError extends Error {
  public name = "FormError"
  constructor(readonly message: string) {
    super(message)
  }
}

export class FormWarning extends Error {
  public name = "FormWarning"
  constructor(readonly message: string) {
    super(message)
  }
}


export function fieldRequired<StateData> (
  value: any,
  formState: FormState,
  stateData: StateData
): Promise<boolean> {
  if (value === null || value === undefined || value === "") {
    return Promise.reject(new FormError('field_required'))
  }

  return Promise.resolve(true)
}


export function emailValidate<StateData> (
  value: any,
  formState: FormState,
  stateData: StateData
): Promise<boolean> {
  if (!value) {
    return Promise.resolve(true)
  }

  const hasAt = value.indexOf('@') > 0

  const hasDot = hasAt
    ? value.split('@')[1].indexOf('.') > 0
    : false
  
  if (!hasAt || !hasDot) {
    return Promise.reject(new FormError('invalid_email'))
  }

  return Promise.resolve(true)
}
