import React from "react"
import ReactDOM from "react-dom"

export default function reactChrome<AppState, UIChromeData> (
  ChromeComponent: any
) {
  return {
    createChrome (
      container: Element, state: AppState, chromeState: UIChromeData,
      appActions: any
    ): any {
      ReactDOM.render(
        <ChromeComponent {...state} {...chromeState} />,
        container
      )
      return {}
    },

    updateChrome (
      container: Element, state: AppState, chromeState: UIChromeData,
      appActions: any
    ): any {
      ReactDOM.render(
        <ChromeComponent {...state} {...chromeState} />,
        container
      )
      return {}
    },

    destroyChrome (container: Element, data: any) {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}
