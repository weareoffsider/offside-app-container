import {createStore, combineReducers} from 'redux'
import OffsideAppContainer from "offsider-app-container"

import {BusinessData, UIData, UIChromeData, ExampleAppActor} from "./ExampleAppData"


function counter(state = 0, action: any) {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    case 'DECREMENT': return state - 1
    default:          return state
  }
}

function postArray(state = [], action: any) {
  switch (action.type) {
    case 'STORE_POSTS': return action.posts
    default:            return state
  }
}

const reducer = combineReducers({
  counter,
  postArray,
})

export default function setupBusinessStore(
  app: OffsideAppContainer<BusinessData, UIData, UIChromeData, any, any>
): (action: any) => void {
  const store = createStore(
    reducer,
    (window as any).devToolsExtension && (window as any).devToolsExtension()
  )

  store.subscribe(() => {
    app.updateAppState("businessData", store.getState())
  })

  return store.dispatch.bind(store)
}

export const businessActions = {
  init () {
    this.businessDispatch({type: 'INIT'})
  },

  storePosts (posts) {
    this.businessDispatch({type: 'STORE_POSTS', posts})
  },

  increment () {
    this.businessDispatch({type: 'INCREMENT'})
  },

  decrement () {
    this.businessDispatch({type: 'DECREMENT'})
  },
}
