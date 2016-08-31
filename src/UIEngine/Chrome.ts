export interface ChromeOptions<UIData, AllChromeData, ChromeData> {
  /* Create the view inside the given container */
  showChrome(container: Element, props: UIData, chromeProps: AllChromeData): ChromeData;

  /* Send updates to the chrome on behalf of this view. */
  updateChrome(container: Element, props: UIData, chromeProps: AllChromeData, data?: ChromeData): ChromeData;

  /* Destroy the chrome */
  hideChrome(container: Element, props: UIData, chromeProps: AllChromeData, data?: ChromeData): Promise<any>;
}

export default class Chrome<UIData, AllChromeData, ChromeData> {
  constructor (private options: ChromeOptions<UIData, AllChromeData, ChromeData>) {
  }
}
