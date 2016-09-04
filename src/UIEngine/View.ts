import {AppState} from '../AppContainer/DataModel'

export interface ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData> {
  /* a preload promise. The UI will show an interstitial loading screen until
   * this promise is resolved */
  preLoad?(props: AppState<BusinessData, UIData>): Promise<any>

  /* a postload promise. Server side renders will wait until it is complete
   * before rendering. Collect optional data here. */
  postLoad?(props: AppState<BusinessData, UIData>): Promise<any>

  /* Create the view inside the given container */
  createView(container: Element, props: AppState<BusinessData, UIData>): ViewRenderData

  /* Send updates to the chrome on behalf of this view. */
  updateChrome?(
    props: AppState<BusinessData, UIData>, chromeData: UIChromeData, data?: ViewRenderData
  ): UIChromeData

  /* Send updated props to the created view */
  updateView(container: Element, props: AppState<BusinessData, UIData>, data: ViewRenderData): ViewRenderData

  /* Destroy the view */
  destroyView(container: Element, props: AppState<BusinessData, UIData>, data: ViewRenderData): void
}

export default class ViewDefinition<BusinessData, UIData, UIChromeData, ViewRenderData> {
  constructor (private options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>) {
  }

  spawnView (
    container: Element, path: string
  ): View<BusinessData, UIData, UIChromeData, ViewRenderData> {
    return new View(container, path, this.options)
  }
}


export class View<BusinessData, UIData, UIChromeData, ViewRenderData> {
  private viewData: ViewRenderData
  private loaded: boolean

  constructor (
    public container: Element,
    public viewPath: string,
    private options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>
  ) {
  }

  preLoadData (props: AppState<BusinessData, UIData>): Promise<any> {
    return (this.options.preLoad
      ? this.options.preLoad(props)
      : Promise.resolve(true)
    ).then((value) => {
      this.loaded = true
      return value
    })
  }

  postLoadData (props: AppState<BusinessData, UIData>): Promise<any> {
    return this.options.postLoad
      ? this.options.postLoad(props)
      : Promise.resolve(true)
  }

  create (props: AppState<BusinessData, UIData>, chromeData: UIChromeData): UIChromeData {
    if (!this.loaded) { return chromeData }
    this.viewData = this.options.createView(this.container, props)

    return this.options.updateChrome
      ? this.options.updateChrome(props, chromeData, this.viewData)
      : chromeData
  }

  update (props: AppState<BusinessData, UIData>, chromeData: UIChromeData) {
    if (!this.loaded) { return chromeData }
    this.viewData = this.options.updateView(
      this.container, props, this.viewData
    )

    return this.options.updateChrome
      ? this.options.updateChrome(props, chromeData, this.viewData)
      : chromeData
  }

  destroy (props: AppState<BusinessData, UIData>) {
    this.options.destroyView(this.container, props, this.viewData)
    this.container.parentNode.removeChild(this.container)
  }
}
