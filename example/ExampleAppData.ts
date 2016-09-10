import {AppState, AppActions, AppActor} from 'offside-app-container'

export type BusinessData = Number

export interface UIData {
  title: string
}

export interface BusinessAction {
  type: string
}

export interface UIAction {
  type: string
}

export type ExampleAppActor = AppActor<BusinessData, UIData, BusinessAction, UIAction>
export type ExampleAppState = AppState<BusinessData, UIData>

export interface ExampleAppProps extends ExampleAppState {
  actions: AppActions<BusinessData, UIData>
}

export interface UIChromeData {
  showHeader: boolean;
  showFooter: boolean;
}
