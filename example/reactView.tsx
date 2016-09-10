import React from "react"
import ReactDOM from "react-dom"

export default function reactView<AppState, UIChromeData> (
  ViewComponent: any
) {
  return {
    preLoad: ViewComponent.preLoad,
    postLoad: ViewComponent.postLoad,

    createView (container: Element, state: AppState, actions: any) {
      ReactDOM.render(<ViewComponent {...state} actions={actions} />, container)
      return {}
    },

    updateChrome: ViewComponent.updateChrome,

    updateView (container: Element, state: AppState, actions: any, data: any) {
      ReactDOM.render(<ViewComponent {...state} actions={actions} />, container)
      return {}
    },

    destroyView (container: Element, data: any) {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}
