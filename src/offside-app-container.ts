import Localize, {LocalizeContext} from './AppContainer/Localize';
import {AppState, AppActions, AppActor} from './AppContainer/DataModel'
import UIContext from './UIEngine/UIContext';


export default class OffsideAppContainer<
  BusinessData, UIData, UIChromeData,
  BusinessAction, UIAction
> {
  public localizeSpawner: Localize
  public activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any>
  public uiContexts: {[key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any>}
  public appState: AppState<BusinessData, UIData>
  public chromeState: UIChromeData
  public appActions: AppActions<BusinessData, UIData>
  public appActor: AppActor<BusinessData, UIData, BusinessAction, UIAction>

  constructor () {
    this.uiContexts = {}

    this.appActor = new AppActor<BusinessData, UIData, BusinessAction, UIAction>()
    this.appActor.setStateGetter = this.getState.bind(this)
    this.appActions = {
      ui: {},
      business: {},
    }
  }

  setBusinessDispatch(func: (a: BusinessAction) => void) {
    this.appActor.setBusinessDispatch(func)
  }

  setBusinessActions(actionObject: any) {
    const binder = (leaf: any) => {
      if (typeof leaf === "object") {
        const funcs: any = {}
        Object.keys(leaf).forEach((funcKey) => {
          funcs[funcKey] = binder(leaf[funcKey])
        })
        return funcs
      } else if (typeof leaf === "function") {
        return leaf.bind(this.appActor)
      } else {
        return leaf
      }
    }

    this.appActions.business = binder(actionObject)
  }

  setUiDispatch(func: (a: UIAction) => void) {
    this.appActor.setUiDispatch(func)
  }

  setUiActions(actionObject: any) {
    const binder = (leaf: any) => {
      if (typeof leaf === "object") {
        const funcs: any = {}
        Object.keys(leaf).forEach((funcKey) => {
          funcs[funcKey] = binder(leaf[funcKey])
        })
        return funcs
      } else if (typeof leaf === "function") {
        return leaf.bind(this.appActor)
      } else {
        return leaf
      }
    }

    this.appActions.ui = binder(actionObject)
  }


  setupLocalisation (translationResources: any) {
    this.localizeSpawner = new Localize(translationResources)
  }

  addUIContext<ViewData, ChromeData> (
    name: string,
    context: UIContext<BusinessData, UIData, UIChromeData, ViewData, ChromeData>
  ) {
    this.uiContexts[name] = context
  }

  loadUIContext (contextName: string) {
    this.activeUI = this.uiContexts[contextName]
    this.activeUI.setContextKey(contextName)
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
    const routes = this.activeUI.routeTable
    this.appState = {l10n, uiData, businessData, route, routes}
    this.chromeState = chromeData
  }

  getState () {
    return this.appState
  }

  initializeUI (container: Element) {
    this.activeUI.setStateGetter(this.getState.bind(this))
    this.setupRouteListeners()
    this.activeUI.initialize(
      container, this.appState, this.chromeState, this.appActions
    )
  }

  updateAppState (key: string, updateValue: any) {
    const nextState: AppState<BusinessData, UIData> = {
      l10n: this.appState.l10n,
      route: this.appState.route,
      routes: this.appState.routes,
      uiData: this.appState.uiData,
      businessData: this.appState.businessData,
    }

    // short circuit if no actual changes given
    if ((nextState as any)[key] === updateValue) {
      return
    }

    if (key === "route") { nextState.route = updateValue }
    if (key === "uiData") { nextState.uiData = updateValue }
    if (key === "businessData") {
      nextState.businessData = updateValue
    }

    this.appState = nextState
    this.activeUI.update(nextState, this.appActions)
  }

  setupRouteListeners () {
    document.addEventListener("click", (e) => {
      let target = e.target as Element
      while (target && target.tagName !== 'A') {
        target = target.parentNode as Element
      }

      if (target && target.getAttribute("href")) {
        const path = target.getAttribute("href")
        if (path.indexOf("http") === 0) { return }
        e.preventDefault()
        const route = this.activeUI.getMatchFromRoute(path)
        window.history.pushState(null, "", path)
        this.updateAppState("route", route)
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
}

export {
  UIContext,
  Localize,
  AppState,
  AppActions,
  AppActor,
}
