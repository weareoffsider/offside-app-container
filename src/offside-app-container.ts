import Localize, {LocalizeContext} from './AppContainer/Localize';
import {AppState} from './AppContainer/DataModel'
import UIContext from './UIEngine/UIContext';


export default class OffsideAppContainer<BusinessData, UIData, UIChromeData> {
  public localizeSpawner: Localize
  public activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any>
  public uiContexts: {[key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any>}
  public appState: AppState<BusinessData, UIData>
  public chromeState: UIChromeData

  constructor () {
    this.uiContexts = {}
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
    this.activeUI.initialize(container, this.appState, this.chromeState)

  }

  updateAppState (key: string, updateValue: any) {
    
    const nextState: AppState<BusinessData, UIData> = {
      l10n: this.appState.l10n,
      route: this.appState.route,
      routes: this.appState.routes,
      uiData: this.appState.uiData,
      businessData: this.appState.businessData,
    }

    if (key === "route") { nextState.route = updateValue }

    this.appState = nextState
    this.activeUI.update(nextState)
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
  AppState
}
