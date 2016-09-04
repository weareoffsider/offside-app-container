import Route from "route-parser"

/* RouteTable
 *
 * A class for managing a set of path routes in the UI Context. View names
 * must correlate to Views in this UI Context's ViewSet.
 */
export default class RouteTable {
  public routes: Array<RouteMatcher>;

  constructor (public routeBase = "") {
    this.routes = [];
  }

  // add a route to the set, they are parsed in sequence so higher
  // priority routes should be added first
  addRoute (routePath: string, viewName: string, routeName?: string) {
    const route = new RouteMatcher(routePath, viewName, routeName)
    this.routes.push(route);
  }

  // take a path and match it to a route, otherwise returning null
  matchPath(fullPath: string) {
    const scopedPath = fullPath.replace(this.routeBase, "")
    const match = this.routes.find((route) => {
      return route.match(scopedPath)
    })

    return match ? match : null;
  }

  // get a path from a provided routeName and parameters
  getPath (routeName: string, params?: any): string {
    if (!params) { params = {} }
    const route = this.routes.find((route) => route.routeName == routeName)

    if (route) {
      return `${this.routeBase}${route.reverse(params)}`
    } else {
      return "/route-not-found"
    }
  }
}


export class RouteMatcher {
  public routeMatcher: any
  public viewName: string
  public routeName: string
  public path: string

  constructor (route?: string, viewName?: string, routeName?: string) {
    if (route && viewName) {
      this.routeMatcher = new Route(route)
      this.viewName = viewName
      this.routeName = routeName ? routeName : viewName
    }
  }

  attachPath (path: string) {
    const matcher = new RouteMatcher()
    matcher.routeMatcher = this.routeMatcher
    matcher.viewName = this.viewName
    matcher.routeName = this.routeName
    matcher.path = path
    return matcher
  }

  match (path: string): boolean {
    return this.routeMatcher.match(path)
  }

  reverse (params?: any): string {
    return this.routeMatcher.reverse(params)
  }
}
