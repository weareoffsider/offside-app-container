import {createStore} from 'redux'
import OffsideAppContainer from "offsider-app-container"

import {BusinessData, UIData, UIChromeData, ExampleAppActor} from "./ExampleAppData"

const defaultState = {
  title: "Start Title",
}

function swapper(state = defaultState, action: any) {
  switch (action.type) {
    case 'SWAP_TITLE':
      return state.title === "Start Title"
        ? {title: "Other Title"}
        : {title: "Start Title"}
    default:
      return state
  }
}

export default function setupUiStore(
  app: OffsideAppContainer<BusinessData, UIData, UIChromeData, any, any>
): (action: any) => void {
  const store = createStore(
    swapper,
    (window as any).devToolsExtension && (window as any).devToolsExtension()
  )

  store.subscribe(() => {
    app.updateAppState("uiData", store.getState())
  })

  return store.dispatch.bind(store)
}

export const uiActions = {
  swapTitle () {
    this.uiDispatch({type: 'SWAP_TITLE'})
  },
}
