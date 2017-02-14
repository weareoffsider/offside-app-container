import {AppState, AppActions} from '../AppContainer/DataModel'

interface ScreenProps {
  screenID: number
  popScreen: () => void
}

export interface ScreenOptions<BusinessData, UIData, ScreenRenderData> {
  renderScreenGuard? (popScreenFunc: any): Element | void

  /* Create the view inside the given container */
  createScreen(
    container: Element, state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>,
    screenProps: ScreenProps
  ): ScreenRenderData

  /* Send updates to the screen on behalf of this view. */
  updateScreen(
    container: Element, state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>,
    screenProps: ScreenProps,
    data?: ScreenRenderData
  ): ScreenRenderData

  destroyScreen(container: Element, data?: ScreenRenderData): void
}

export default class ScreenDefinition<BusinessData, UIData, ScreenRenderData> {
  constructor (private options: ScreenOptions<BusinessData, UIData, ScreenRenderData>) {
  }

  getOptions () {
    return this.options
  }
}

export class Screen<BusinessData, UIData, ScreenRenderData> {
  private screenData: ScreenRenderData
  private screenProps: any

  constructor (
    private id: number,
    private container: Element,
    private options: ScreenOptions<BusinessData, UIData, ScreenRenderData>,
    popScreenFunc: any,
    private screenGuard?: Element | void
  ) {
    this.screenProps = {
      screenId: this.id,
      popScreen: popScreenFunc,
    }
  }

  getId (): number { return this.id }

  create (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.screenData = this.options.createScreen(
      this.container, state, actions, this.screenProps
    )
  }

  update (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.screenData = this.options.updateScreen(
      this.container, state, actions, this.screenProps, this.screenData
    )
  }

  destroy (
  ) {
    this.options.destroyScreen(this.container, this.screenData)
    this.container.parentNode.removeChild(this.container)
    if (this.screenGuard) {
      this.screenGuard.parentNode.removeChild(this.screenGuard)
    }
  }
}
