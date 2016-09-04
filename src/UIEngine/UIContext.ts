import ViewDefinition, {ViewOptions, View} from './View'
import ChromeDefinition, {ChromeOptions, Chrome} from './Chrome'
import RouteTable from './RouteTable'

export default class UIContext<UIData, UIChromeData, ViewData, ChromeData> {
  private contextKey: string
  private viewSet:
    {[key: string]: ViewDefinition<UIData, UIChromeData, ViewData>}
  private chromeSet:
    {[key: string]: ChromeDefinition<UIData, UIChromeData, ChromeData>}
  private activeChrome:
    {[key: string]: Chrome<UIData, UIChromeData, ChromeData>}
  private routeTable: RouteTable
  private viewContainer: Element
  private activeView:
    {[route: string]: View<UIData, UIChromeData, ViewData>}
  private renderOrder: Array<string>

  constructor (urlBase: string) {
    this.viewSet = {}
    this.chromeSet = {}
    this.activeChrome = {}
    this.routeTable = new RouteTable()
  }

  addView (
    key: string,
    viewOptions: ViewOptions<UIData, UIChromeData, ViewData>
  ) {
    this.viewSet[key] = new ViewDefinition(viewOptions)
  }

  addChrome (
    key: string,
    chromeOptions: ChromeOptions<UIData, UIChromeData, ChromeData>
  ) {
    this.chromeSet[key] = new ChromeDefinition(chromeOptions)
  }

  addRoute (routePath: string, viewName: string, routeName?: string) {
    this.routeTable.addRoute(routePath, viewName, routeName)
  }

  setRenderOrder (newOrder: Array<string>) {
    this.renderOrder = newOrder
  }

  setContextKey (contextKey: string) {
    this.contextKey = contextKey
  }

  initialize (container: Element, props: UIData, chromeProps: UIChromeData) {
    console.log("UIContext INIT", this.renderOrder, this.chromeSet)
    this.renderOrder.forEach((name) => {
      if (name !== "**views") {
        const chromeContainer = document.createElement("span")
        chromeContainer.id = `${this.contextKey}-${name}`
        container.appendChild(chromeContainer)

        this.activeChrome[name] = new Chrome(
            chromeContainer,
            this.chromeSet[name].getOptions()
        )
        this.activeChrome[name].initialize(props, chromeProps)
      } else {
        const viewsContainer = document.createElement("span")
        viewsContainer.id = `${this.contextKey}-viewsContainer`
        container.appendChild(viewsContainer)
        this.viewContainer = viewsContainer
      }
    })
  }
}
