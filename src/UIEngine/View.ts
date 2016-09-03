export interface ViewOptions<UIData, UIChromeData, ViewData> {
  /* a preload promise. The UI will show an interstitial loading screen until
   * this promise is resolved */
  preLoad?(props: UIData): Promise<any>;

  /* a postload promise. Server side renders will wait until it is complete
   * before rendering. Collect optional data here. */
  postLoad?(props: UIData): Promise<any>;

  /* Create the view inside the given container */
  createView(container: Element, props: UIData): ViewData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome?(
    props: UIData, chromeData: UIChromeData, data?: ViewData
  ): UIChromeData;

  /* Send updated props to the created view */
  updateView(container: Element, props: UIData, data: ViewData): ViewData;

  /* Destroy the view */
  destroyView(container: Element, props: UIData, data: ViewData): void
}

export default class ViewDefinition<UIData, UIChromeData, ViewData> {
  constructor (private options: ViewOptions<UIData, UIChromeData, ViewData>) {
  }
}


export class View<UIData, UIChromeData, ViewData> {
  private viewData: ViewData

  constructor (
    private container: Element,
    private options: ViewOptions<UIData, UIChromeData, ViewData>
  ) {
  }

  preLoadData (props: UIData): Promise<any> {
    return this.options.preLoad
      ? this.options.preLoad(props)
      : Promise.resolve(true)
  }

  postLoadData (props: UIData): Promise<any> {
    return this.options.postLoad
      ? this.options.postLoad(props)
      : Promise.resolve(true)
  }

  create (props: UIData, chromeData: UIChromeData): UIChromeData {
    this.viewData = this.options.createView(this.container, props)

    return this.options.updateChrome
      ? this.options.updateChrome(props, chromeData, this.viewData)
      : chromeData
  }

  update (props: UIData, chromeData: UIChromeData) {
    this.viewData = this.options.updateView(
      this.container, props, this.viewData
    )

    return this.options.updateChrome
      ? this.options.updateChrome(props, chromeData, this.viewData)
      : chromeData
  }

  destroy (props: UIData) {
    this.options.destroyView(this.container, props, this.viewData)
  }
}
