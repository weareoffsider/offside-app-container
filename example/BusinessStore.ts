import {createStore} from 'redux'
import OffsideAppContainer from "offside-app-container"

import {BusinessData, UIData, UIChromeData, ExampleAppActor} from "./ExampleAppData"


function counter(state = 0, action: any) {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    case 'DECREMENT': return state - 1
    default:          return state
  }
}

export default function setupBusinessStore(
  app: OffsideAppContainer<BusinessData, UIData, UIChromeData, any, any>
): (action: any) => void {
  const store = createStore(
    counter,
    (window as any).devToolsExtension && (window as any).devToolsExtension()
  )

  store.subscribe(() => {
    app.updateAppState("businessData", store.getState())
  })

  return store.dispatch.bind(store)
}

export const businessActions = {
  increment () {
    this.businessDispatch({type: 'INCREMENT'})
  },

  decrement () {
    this.businessDispatch({type: 'DECREMENT'})
  },
}
