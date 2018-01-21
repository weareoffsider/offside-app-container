import Localize, {LocalizeContext} from './AppContainer/Localize'
import CommsChannel, {defaultErrorProcessing, CommsChannelState} from './Comms/CommsChannel'
import {
  RequestServerError, RequestOfflineError,
  RequestForbiddenError, RequestNotFoundError,
  RequestClientError,
} from './Comms/Errors'
import FormInstance from './Forms/FormInstance'
import FormDefinition, {
  FormStepDefinition, FormFieldDefinition, FormValidationStyle,
} from './Forms/FormDefinition'
import {FormError, FormWarning} from './Forms/FormValidators'

import RouteTable, {RouteMatcher} from './UIEngine/RouteTable'
import {FormState} from './Forms/FormData'
import {AppState, AppActions, AppActor} from './AppContainer/DataModel'
import UIContext from './UIEngine/UIContext'


export default class OffsideAppContainer<
  BusinessData, UIData, UIChromeData,
  BusinessAction, UIAction
> {
  public localizeSpawner: Localize
  public activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any, any>
  public uiContexts: {[key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any, any>}
  public commsChannels: {[key: string]: CommsChannel}
  public appState: AppState<BusinessData, UIData>
  public chromeState: UIChromeData
  public appActions: AppActions<BusinessData, UIData>
  public appActor: AppActor<BusinessData, UIData, BusinessAction, UIAction>

  constructor () {
    this.uiContexts = {}
    this.commsChannels = {}

    this.appActor = new AppActor<BusinessData, UIData, BusinessAction, UIAction>()
    this.appActor.setStateGetter(this.getState.bind(this))
    this.appActor.setActionsGetter(this.getActions.bind(this))
    this.appActions = {
      ui: {},
      business: {},
      comms: {},
      routes: {
        goTo: this.goToRoute.bind(this),
      },
    }
  }

  setBusinessDispatch(func: (a: BusinessAction) => void) {
    this.appActor.setBusinessDispatch(func)
  }

  bindActor (leaf: any): any {
    if (typeof leaf === "object") {
      const funcs: any = {}
      Object.keys(leaf).forEach((funcKey) => {
        funcs[funcKey] = this.bindActor(leaf[funcKey])
      })
      return funcs
    } else if (typeof leaf === "function") {
      return leaf.bind(this.appActor)
    } else {
      return leaf
    }
  }

  setBusinessActions(actionObject: any) {
    this.appActions.business = this.bindActor(actionObject)
  }

  addCommsChannel(commsChannel: CommsChannel) {
    this.commsChannels[commsChannel.name] = commsChannel
    this.appActions.comms[commsChannel.name] = commsChannel.actions()
    commsChannel.setStateSetter(this.updateCommsState.bind(this))
  }

  setUiDispatch(func: (a: UIAction) => void) {
    this.appActor.setUiDispatch(func)
  }

  setUiActions(actionObject: any) {
    this.appActions.ui = this.bindActor(actionObject)
  }


  setupLocalisation (translationResources: any) {
    this.localizeSpawner = new Localize(translationResources)
  }

  addUIContext<ViewData, ChromeData, ScreenData> (
    name: string,
    context: UIContext<BusinessData, UIData, UIChromeData, ViewData, ChromeData, ScreenData>
  ) {
    this.uiContexts[name] = context
  }

  loadUIContext (contextName: string) {
    this.activeUI = this.uiContexts[contextName]
    this.activeUI.setContextKey(contextName)
    this.appActions.screenStack = this.activeUI.screenActions()
  }

  initializeAppState(
    lang: string,
    businessData: BusinessData,
    uiData: UIData,
    chromeData: UIChromeData
  ) {
    if (!this.activeUI) {
      throw new Error("UI Context must be loaded before initializing app.")
    }
    const l10n = this.localizeSpawner.loadLocale(lang)
    const route = this.activeUI.getMatchFromRoute(window.location.pathname)
    const comms: {[key: string]: CommsChannelState} = {}

    Object.keys(this.commsChannels).forEach((name) => {
      comms[name] = this.commsChannels[name].getState()
    })

    const routes = this.activeUI.routeTable
    this.appState = {l10n, uiData, businessData, route, routes, comms}
    this.chromeState = chromeData
  }

  getState () {
    return this.appState
  }

  getActions () {
    return this.appActions
  }

  getActor () {
    return this.appActor
  }

  initializeUI (container: Element) {
    this.activeUI.setStateGetter(this.getState.bind(this))
    this.activeUI.setActionsGetter(this.getActions.bind(this))
    this.setupRouteListeners()
    this.activeUI.initialize(
      container, this.appState, this.chromeState, this.appActions
    )
  }

  updateCommsState (key: string, state: CommsChannelState) {
    const nextComms: {[key: string]: CommsChannelState} = {}

    Object.keys(this.appState.comms).forEach((name) => {
      nextComms[name] = this.appState.comms[name]
    })

    nextComms[key] = state

    this.updateAppState("comms", nextComms)
  }

  updateAppState (key: string, updateValue: any) {
    const nextState: AppState<BusinessData, UIData> = {
      l10n: this.appState.l10n,
      route: this.appState.route,
      routes: this.appState.routes,
      comms: this.appState.comms,
      uiData: this.appState.uiData,
      businessData: this.appState.businessData,
    }

    // short circuit if no actual changes given
    if ((nextState as any)[key] === updateValue) {
      return
    }

    if (key === "route") { nextState.route = updateValue }
    if (key === "comms") { nextState.comms = updateValue }
    if (key === "uiData") { nextState.uiData = updateValue }
    if (key === "businessData") { nextState.businessData = updateValue }

    this.appState = nextState
    this.activeUI.update(nextState, this.appActions)
  }

  setupRouteListeners () {
    document.addEventListener("click", (e) => {
      let target = e.target as Element
      while (target && target.tagName !== 'A') {
        target = target.parentNode as Element
      }

      if (
        target &&
        target.getAttribute("href") &&
        !target.getAttribute("download") &&
        !target.getAttribute("target")
      ) {
        const path = target.getAttribute("href")
        if (path.indexOf("http") === 0) { return }
        const route = this.activeUI.getMatchFromRoute(path)
        if (route) {
          e.preventDefault()
          window.history.pushState(null, "", path)
          this.updateAppState("route", route)
        }
      }
    })

    window.onpopstate = (event) => {
      const path = window.location.pathname
      const route = this.activeUI.getMatchFromRoute(path)
      this.updateAppState("route", route)
    }

    window.onpageshow = (event) => {
      const path = window.location.pathname
      const route = this.activeUI.getMatchFromRoute(path)
      this.updateAppState("route", route)
    }
  }

  goToRoute (path: string) {
    if (window.location.pathname != path) {
      const route = this.activeUI.getMatchFromRoute(path)
      window.history.pushState(null, "", path)
      this.updateAppState("route", route)
    }
  }
}

const OffsideAppContainerObject = {
  OffsideAppContainer,
  UIContext,
  CommsChannel,
  CommsDefaultErrorProcessing: defaultErrorProcessing,
  RequestServerError, RequestOfflineError,
  RequestForbiddenError, RequestNotFoundError,
  RequestClientError,
  Localize,
  AppActor,
  FormInstance,
  FormDefinition,
  FormStepDefinition,
  FormFieldDefinition,
  FormValidationStyle,
  FormError,
  FormWarning,
  RouteTable,
  RouteMatcher,
}

export {
  UIContext,
  CommsChannel,
  defaultErrorProcessing,
  RequestServerError, RequestOfflineError,
  RequestForbiddenError, RequestNotFoundError,
  RequestClientError,
  Localize,
  AppState,
  AppActions,
  AppActor,
  FormInstance,
  FormDefinition,
  FormStepDefinition,
  FormFieldDefinition,
  FormValidationStyle,
  FormError,
  FormWarning,
  RouteTable,
  RouteMatcher,
}


if (typeof window !== "undefined") {
  (window as any)['OffsideAppContainer'] = OffsideAppContainerObject
}
