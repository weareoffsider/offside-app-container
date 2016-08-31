export interface ViewOptions<UIData, AllChromeData, ViewData> {
  /* a preload promise. The UI will show an interstitial loading screen until
   * this promise is resolved */
  preLoad?(props: UIData): Promise<any>;

  /* a postload promise. Server side renders will wait until it is complete
   * before rendering. Collect optional data here. */
  postLoad?(props: UIData): Promise<any>;

  /* Create the view inside the given container */
  createView?(container: Element, props: UIData): ViewData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome?(props: UIData, data?: ViewData): AllChromeData;

  /* Send updated props to the created view */
  updateView?(container: Element, props: UIData, data: ViewData): ViewData;

  /* Destroy the view */
  destroyView?(container: Element, props: UIData, data: ViewData): void
}

export default class View<UIData, AllChromeData, ViewData> {
  constructor (private options: ViewOptions<UIData, AllChromeData, ViewData>) {
  }
}
