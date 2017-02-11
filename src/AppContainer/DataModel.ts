import Localize, {LocalizeContext} from './Localize';
import {CommsActions, CommsChannelState} from "../Comms/CommsChannel"
import RouteTable, {RouteMatcher} from '../UIEngine/RouteTable'
import {FormState} from '../Forms/FormData'

export interface AppState<BusinessData, UIData> {
  l10n: LocalizeContext
  route?: RouteMatcher
  comms: {[key: string]: CommsChannelState}
  forms: {[key: string]: FormState}
  routes: RouteTable
  uiData: UIData
  businessData: BusinessData
}

export interface AppActions<BusinessData, UIData> {
  business?: any
  ui?: any
  forms?: any
  routes?: any
  screenStack?: any
  comms: {[key: string]: CommsActions}
}


export class AppActor<BusinessData, UIData, BusinessAction, UIAction> {
  public getAppState: () => AppState<BusinessData, UIData>
  public businessDispatch: (a: BusinessAction) => void
  public uiDispatch: (a: UIAction) => void

  setStateGetter(func: () => AppState<BusinessData, UIData>) {
    this.getAppState = func
  }

  setBusinessDispatch(func: (a: BusinessAction) => void) {
    this.businessDispatch = func
  }

  setUiDispatch(func: (a: UIAction) => void) {
    this.uiDispatch = func
  }
}


export interface BusinessDataInterface<BusinessData, BusinessAction> {
  dispatch: (action: BusinessAction) => void
}
