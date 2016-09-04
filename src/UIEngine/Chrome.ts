import {AppState} from '../AppContainer/DataModel'

export interface ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData> {
  /* Create the view inside the given container */
  initializeChrome(
    container: Element, props: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData
  ): ChromeRenderData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome(
    container: Element, props: AppState<BusinessData, UIData>,
    chromeProps: UIChromeData, data?: ChromeRenderData
  ): ChromeRenderData;
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

  initialize (props: AppState<BusinessData, UIData>, chromeProps: UIChromeData) {
    this.chromeData = this.options.initializeChrome(
      this.container, props, chromeProps
    )
  }

  update (props: AppState<BusinessData, UIData>, chromeProps: UIChromeData) {
    this.chromeData = this.options.updateChrome(
      this.container, props, chromeProps
    )
  }
}
