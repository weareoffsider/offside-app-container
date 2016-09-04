import ViewDefinition, {ViewOptions, View} from './View'
import ChromeDefinition, {ChromeOptions, Chrome} from './Chrome'
import RouteTable, {RouteMatcher} from './RouteTable'
import {AppState} from '../AppContainer/DataModel'

export default class UIContext<BusinessData, UIData, UIChromeData,
                               ViewRenderData, ChromeRenderData> {
  private contextKey: string
  private viewSet:
    {[key: string]: ViewDefinition<BusinessData, UIData, UIChromeData, ViewRenderData>}
  private chromeSet:
    {[key: string]: ChromeDefinition<BusinessData, UIData, UIChromeData, ChromeRenderData>}
  private activeChrome:
    {[key: string]: Chrome<BusinessData, UIData, UIChromeData, ChromeRenderData>}
  public routeTable: RouteTable
  private viewContainer: Element
  private visibleViews:
    {[route: string]: View<BusinessData, UIData, UIChromeData, ViewRenderData>}
  private activeView: View<BusinessData, UIData, UIChromeData, ViewRenderData>
  private exitingView: View<BusinessData, UIData, UIChromeData, ViewRenderData>
  private renderOrder: Array<string>
  private getLatestAppState: () => AppState<BusinessData, UIData>
  private chromeState: UIChromeData

  constructor (urlBase: string) {
    this.viewSet = {}
    this.chromeSet = {}
    this.activeChrome = {}
    this.visibleViews = {}
    this.routeTable = new RouteTable()
  }

  addView (
    key: string,
    viewOptions: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>
  ) {
    this.viewSet[key] = new ViewDefinition(viewOptions)
  }

  addChrome (
    key: string,
    chromeOptions: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>
  ) {
    this.chromeSet[key] = new ChromeDefinition(chromeOptions)
  }

  addRoute (routePath: string, viewName: string, routeName?: string) {
    this.routeTable.addRoute(routePath, viewName, routeName)
  }

  getMatchFromRoute (path: string): RouteMatcher {
    const match = this.routeTable.matchPath(path)
    return match ? match.attachPath(path) : null
  }

  setRenderOrder (newOrder: Array<string>) { this.renderOrder = newOrder }
  setContextKey (contextKey: string) { this.contextKey = contextKey }
  setStateGetter (getter: () => AppState<BusinessData, UIData>) {
    this.getLatestAppState = getter
  }

  initialize (container: Element, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData) {
    console.log("UIContext INIT", this.renderOrder, this.chromeSet, this.viewSet, props)
    this.chromeState = chromeProps
    this.renderOrder.forEach((name) => {
      if (name !== "**views") {
        const chromeContainer = document.createElement("div")
        chromeContainer.id = `${this.contextKey}-${name}`
        container.appendChild(chromeContainer)

        this.activeChrome[name] = new Chrome(
            chromeContainer,
            this.chromeSet[name].getOptions()
        )
        this.activeChrome[name].initialize(props, chromeProps)
      } else {
        console.log("render root")
        const viewsContainer = document.createElement("div")
        viewsContainer.id = `${this.contextKey}-viewsContainer`
        container.appendChild(viewsContainer)
        this.viewContainer = viewsContainer
      }
    })

    if (props.route) {
      this.loadRoute(props.route, props, chromeProps)
    }
  }

  update (state: AppState<BusinessData, UIData>) {
    if (state.route.path !== this.activeView.viewPath) {
      this.loadRoute(state.route, state, this.chromeState)
    }
    this.chromeState = this.activeView.update(state, this.chromeState)

    Object.keys(this.activeChrome).forEach((name) => {
      const chrome = this.activeChrome[name]
      chrome.update(state, this.chromeState)
    })
  }

  loadRoute (route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData) {
    if (!route.path) {
      throw new Error("Route views can only be loaded with paths.")
    }

    if (this.activeView) {
      this.exitingView = this.activeView
    }

    const container = document.createElement("div")
    container.className = `${this.contextKey}-${route.viewName}`
    this.viewContainer.appendChild(container)

    const view = this.viewSet[route.viewName].spawnView(container, route.path)
    this.visibleViews[route.path] = view
    this.activeView = view
    const viewReadyPromise = view.preLoadData(props)
        .then((state) => {
          console.log("Creating View", view)
          view.create(this.getLatestAppState(), chromeProps)
        })

    console.log("Loading route", route)
    this.transitionViews(this.activeView, viewReadyPromise, this.exitingView)
  }

  transitionViews (
    entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>,
    loadingPromise: Promise<any>,
    exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>
  ) {
    if (exiting) {
      const exitContainer = exiting.container as HTMLElement
      exitContainer.style.opacity = "0.5"

      loadingPromise.then((result) => {
        exiting.destroy(this.getLatestAppState())
      })
    }
  }
}
