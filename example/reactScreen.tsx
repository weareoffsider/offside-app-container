import React from "react"
import ReactDOM from "react-dom"

export default function reactScreen<AppState, UIScreenData> (
  ScreenComponent: any
) {
  return {
    createScreen (
      container: Element, state: AppState,
      appActions: any, screenProps: any
    ): any {
      ReactDOM.render(
        <ScreenComponent {...state} {...screenProps} />,
        container
      )
      return {}
    },

    updateScreen (
      container: Element, state: AppState,
      appActions: any, screenProps: any
    ): any {
      ReactDOM.render(
        <ScreenComponent {...state} {...screenProps} />,
        container
      )
      return {}
    },

    destroyScreen (container: Element, data: any) {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}
