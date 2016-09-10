import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppProps, ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Header extends React.Component<ExampleAppProps, any> {
  static preLoad (state: ExampleAppState) {
    console.log("preloading")
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("resolving preload")
        resolve(true)
      }, 2000)
    })
  }

  render () {
    const {l10n, routes, businessData, actions} = this.props
    const t_ = l10n.translate

    return <section className="HomePage">
      <h1>App Body in Heyah</h1>
      <button onClick={actions.ui.swapTitle}>{t_('swap_title')}</button>
      <h3>Counter</h3>
      <button onClick={actions.business.decrement}>-</button>
      <span>{businessData}</span>
      <button onClick={actions.business.increment}>+</button>
      <br />
      <br />
      <a href={routes.getPath('about')}>{t_('about')}</a>
    </section>
  }
}
