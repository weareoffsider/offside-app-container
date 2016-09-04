import {AppState} from 'offside-app-container'

export interface BusinessData {
}

export interface UIData {
  title: string;
}

export type ExampleAppState = AppState<BusinessData, UIData>

export interface UIChromeData {
  showHeader: boolean;
  showFooter: boolean;
}
