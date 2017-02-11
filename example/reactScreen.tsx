import React from "react"
import ReactDOM from "react-dom"

export default function reactScreen<AppState, UIScreenData> (
  ScreenComponent: any
) {
  return {
    createScreen (
      container: Element, state: AppState,
      appActions: any
    ) {
      ReactDOM.render(
        <ScreenComponent {...state} />,
        container
      )
      return {}
    },

    updateScreen (
      container: Element, state: AppState,
      appActions: any
    ) {
      ReactDOM.render(
        <ScreenComponent {...state} />,
        container
      )
      return {}
    }

    destroyScreen (container: Element, data: any) {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}
