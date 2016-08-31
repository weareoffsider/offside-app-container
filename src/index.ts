import Localize from './AppContainer/Localize';
import UIContext from './UIEngine/UIContext';

export default class OffsideAppContainer<UIData, UIChromeData> {
  public localizeSpawner: Localize
  public uiContexts: Array<UIContext<UIData, UIChromeData, any, any>>

  constructor () {
    this.uiContexts = [];
  }

  setupLocalisation (translationResources: any) {
    this.localizeSpawner = new Localize(translationResources)
  }

  setupUIContext<ViewData, ChromeData> (
    context: UIContext<UIData, UIChromeData, ViewData, ChromeData>
  ) {
    this.uiContexts.push(context);
  }
}

export {
  UIContext,
  Localize,
}
