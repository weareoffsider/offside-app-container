import React from "react"
import ReactDOM from "react-dom"

export default function reactView<AppState, UIChromeData> (
  ViewComponent: any
) {
  return {
    preLoad: ViewComponent.preLoad,
    postLoad: ViewComponent.postLoad,

    createView (container: Element, state: AppState) {
      ReactDOM.render(<ViewComponent {...state} />, container)
      return {}
    },

    updateChrome: ViewComponent.updateChrome,

    updateView (container: Element, state: AppState, data: any) {
      ReactDOM.render(<ViewComponent {...state} />, container)
      return {}
    },

    destroyView (container: Element, state: AppState, data: any) {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}
