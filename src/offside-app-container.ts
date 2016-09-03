import Localize, {LocalizeContext} from './AppContainer/Localize';
import UIContext from './UIEngine/UIContext';

export default class OffsideAppContainer<EngineData, UIData, UIChromeData> {
  public localizeSpawner: Localize
  public activeUIContext: UIContext<UIData, UIChromeData, any, any>
  public uiContexts: {[key: string]: UIContext<UIData, UIChromeData, any, any>}

  constructor () {
    this.uiContexts = {}
  }

  setupLocalisation (translationResources: any) {
    this.localizeSpawner = new Localize(translationResources)
  }

  addUIContext<ViewData, ChromeData> (
    name: string,
    context: UIContext<UIData, UIChromeData, ViewData, ChromeData>
  ) {
    this.uiContexts[name] = context
  }

  loadUIContext (container: Element, contextName: string) {
    this.activeUIContext = this.uiContexts[contextName]
    this.activeUIContext.initialize(container)
  }
}

export {
  UIContext,
  Localize,
}
