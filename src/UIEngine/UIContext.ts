import View, {ViewOptions} from './View'
import Chrome, {ChromeOptions} from './Chrome'
import RouteTable from './RouteTable'

export default class UIContext<UIData, UIChromeData, ViewData, ChromeData> {
  private viewSet: {[key: string]: View<UIData, UIChromeData, ViewData>}
  private chromeSet: {[key: string]: Chrome<UIData, UIChromeData, ChromeData>}
  private routeTable: RouteTable
  private renderOrder: Array<string>

  constructor (urlBase: string) {
    this.viewSet = {}
    this.chromeSet = {}
    this.routeTable = new RouteTable()
  }

  addView (
    key: string,
    viewOptions: ViewOptions<UIData, UIChromeData, ViewData>
  ) {
    this.viewSet[key] = new View(viewOptions)
  }

  addChrome (
    key: string,
    chromeOptions: ChromeOptions<UIData, UIChromeData, ChromeData>
  ) {
    this.chromeSet[key] = new Chrome(chromeOptions)
  }

  addRoute (routePath: string, viewName: string, routeName?: string) {
    this.routeTable.addRoute(routePath, viewName, routeName)
  }

  setRenderOrder (newOrder: Array<string>) {
    this.renderOrder = newOrder
  }
}
