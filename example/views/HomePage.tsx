import React from "react"
import ReactDOM from "react-dom"
import {
  ExampleAppProps, ExampleAppState, UIChromeData,
  ExampleAppActions
} from "../ExampleAppData"

export default class Header extends React.Component<ExampleAppProps, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    console.log("preloading")
    return actions.comms['placeholder'].get("/posts/1")
  }

  render () {
    const {l10n, routes, businessData, actions} = this.props
    const t_ = l10n.translate

    return <section className="HomePage">
      <h1>App Body in Heyah</h1>
      <button onClick={actions.ui.swapTitle}>{t_('swap_title')}</button>
      <h3>Counter</h3>
      <button onClick={actions.business.decrement}>-</button>
      <span>{businessData.counter}</span>
      <button onClick={actions.business.increment}>+</button>
      <br />
      <br />
      <a href={routes.getPath('about')}>{t_('about')}</a>
      <br />
      <a href={routes.getPath('registration')}>{t_('registration')}</a>
    </section>
  }
}
