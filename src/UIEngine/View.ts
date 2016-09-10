import {AppState, AppActions} from '../AppContainer/DataModel'
import {RouteMatcher} from './RouteTable'

export interface ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData> {
  /* a preload promise. The UI will show an interstitial loading screen until
   * this promise is resolved */
  preLoad?(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>

  /* a postload promise. Server side renders will wait until it is complete
   * before rendering. Collect optional data here. */
  postLoad?(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>

  /* Create the view inside the given container */
  createView(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): ViewRenderData

  /* Send updates to the chrome on behalf of this view. */
  updateChrome?(
    state: AppState<BusinessData, UIData>, chromeData: UIChromeData, data?: ViewRenderData
  ): UIChromeData

  /* Send updated state to the created view */
  updateView(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>, data: ViewRenderData): ViewRenderData

  /* Destroy the view */
  destroyView(container: Element, data?: ViewRenderData): void
}

export default class ViewDefinition<BusinessData, UIData, UIChromeData, ViewRenderData> {
  constructor (private options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>) {
  }

  spawnView (
    container: Element, route: RouteMatcher
  ): View<BusinessData, UIData, UIChromeData, ViewRenderData> {
    return new View(container, route, this.options)
  }
}


export class View<BusinessData, UIData, UIChromeData, ViewRenderData> {
  private viewData: ViewRenderData
  private loaded: boolean

  constructor (
    public container: Element,
    public route: RouteMatcher,
    private options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>
  ) {
  }

  preLoadData (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ): Promise<any> {
    return (this.options.preLoad
      ? this.options.preLoad(state, actions)
      : Promise.resolve(true)
    ).then((value) => {
      this.loaded = true
      return value
    })
  }

  postLoadData (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ): Promise<any> {
    return this.options.postLoad
      ? this.options.postLoad(state, actions)
      : Promise.resolve(true)
  }

  create (
    state: AppState<BusinessData, UIData>,
    chromeData: UIChromeData,
    actions: AppActions<BusinessData, UIData>
  ): UIChromeData {
    if (!this.loaded) { return chromeData }
    this.viewData = this.options.createView(this.container, state, actions)

    return this.options.updateChrome
      ? this.options.updateChrome(state, chromeData, this.viewData)
      : chromeData
  }

  update (
    state: AppState<BusinessData, UIData>,
    chromeData: UIChromeData,
    actions: AppActions<BusinessData, UIData>
  ) {
    if (!this.loaded) { return chromeData }
    this.viewData = this.options.updateView(
      this.container, state, actions, this.viewData
    )

    return this.options.updateChrome
      ? this.options.updateChrome(state, chromeData, this.viewData)
      : chromeData
  }

  destroy (
  ) {
    this.options.destroyView(this.container, this.viewData)
    this.container.parentNode.removeChild(this.container)
  }
}
