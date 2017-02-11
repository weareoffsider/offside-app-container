import {AppState, AppActions} from '../AppContainer/DataModel'

export interface ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData> {
  /* Create the view inside the given container */
  createChrome(
    container: Element, state: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData,
    actions: AppActions<BusinessData, UIData>
  ): ChromeRenderData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome(
    container: Element, state: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>,
    data?: ChromeRenderData
  ): ChromeRenderData;

  destroyChrome(container: Element, data?: ChromeRenderData): void
}

export default class ChromeDefinition<BusinessData, UIData, UIChromeData, ChromeRenderData> {
  constructor (private options: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>) {
  }

  getOptions () {
    return this.options
  }
}

export class Chrome<BusinessData, UIData, UIChromeData, ChromeRenderData> {
  private chromeData: ChromeRenderData

  constructor (
    private container: Element,
    private options: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>
  ) {
  }

  create (
    state: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.chromeData = this.options.createChrome(
      this.container, state, chromeProps, actions
    )
  }

  update (
    state: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.chromeData = this.options.updateChrome(
      this.container, state, chromeProps,actions, this.chromeData
    )
  }

  destroy (
  ) {
    this.options.destroyChrome(this.container, this.chromeData)
  }
}
