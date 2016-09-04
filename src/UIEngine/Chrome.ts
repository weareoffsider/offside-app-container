export interface ChromeOptions<UIData, UIChromeData, ChromeData> {
  /* Create the view inside the given container */
  initializeChrome(
    container: Element, props: UIData,
    chromeProps: UIChromeData
  ): ChromeData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome(
    container: Element, props: UIData,
    chromeProps: UIChromeData, data?: ChromeData
  ): ChromeData;
}

export default class ChromeDefinition<UIData, UIChromeData, ChromeData> {
  constructor (private options: ChromeOptions<UIData, UIChromeData, ChromeData>) {
  }

  getOptions () {
    return this.options
  }
}

export class Chrome<UIData, UIChromeData, ChromeData> {
  private chromeData: ChromeData

  constructor (
    private container: Element,
    private options: ChromeOptions<UIData, UIChromeData, ChromeData>
  ) {
  }

  initialize (props: UIData, chromeProps: UIChromeData) {
    this.chromeData = this.options.initializeChrome(
      this.container, props, chromeProps
    )
  }

  update (props: UIData, chromeProps: UIChromeData) {
    this.chromeData = this.options.updateChrome(
      this.container, props, chromeProps
    )
  }
}
