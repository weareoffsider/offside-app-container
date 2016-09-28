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


export function fieldRequired<BusinessData, UIData, BusinessAction, UIAction> (
  value: any,
  appState: AppState<BusinessData, UIData>,
  appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>
): Promise<boolean> {
  const {l10n} = appState
  const {translate} = l10n

  if (value === null || value === undefined || value === "") {
    return Promise.reject(new FormError(
      translate('form_validation.field_required')
    ))
  }

  return Promise.resolve(true)
}
