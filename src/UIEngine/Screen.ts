import {AppState, AppActions} from '../AppContainer/DataModel'

export interface ScreenOptions<BusinessData, UIData, ScreenRenderData> {
  /* Create the view inside the given container */
  createScreen(
    container: Element, state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ): ScreenRenderData

  /* Send updates to the screen on behalf of this view. */
  updateScreen(
    container: Element, state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>,
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

  constructor (
    private container: Element,
    private options: ScreenOptions<BusinessData, UIData, ScreenRenderData>
  ) {
  }

  create (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.screenData = this.options.createScreen(
      this.container, state, actions
    )
  }

  update (
    state: AppState<BusinessData, UIData>,
    actions: AppActions<BusinessData, UIData>
  ) {
    this.screenData = this.options.updateScreen(
      this.container, state, actions, this.screenData
    )
  }

  destroy (
  ) {
    this.options.destroyScreen(this.container, this.screenData)
    this.container.parentNode.removeChild(this.container)
  }
}
