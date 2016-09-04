import React from "react"
import ReactDOM from "react-dom"

export default function reactChrome<AppState, UIChromeData> (
  ChromeComponent: any
) {
  return {
    initializeChrome (
      container: Element, state: AppState, chromeState: UIChromeData
    ) {
      ReactDOM.render(
        <ChromeComponent {...state} {...chromeState} />,
        container
      )
      return {}
    },

    updateChrome (
      container: Element, state: AppState, chromeState: UIChromeData
    ) {
      ReactDOM.render(
        <ChromeComponent {...state} {...chromeState} />,
        container
      )
      return {}
    }
  }
}
