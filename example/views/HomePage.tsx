import React from "react"
import ReactDOM from "react-dom"
import {
  ExampleAppProps, ExampleAppState, UIChromeData,
  ExampleAppActions
} from "../ExampleAppData"

import reactScreen from '../reactScreen'
import DialogScreen from '../screens/DialogScreen'

export default class Header extends React.Component<ExampleAppProps, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    return actions.comms['placeholder'].get("/posts/1")
  }

  constructor (props, context) {
    super(props, context)
    this.showDialog = this.showDialog.bind(this)
  }

  showDialog (e) {
    const {actions: {screenStack: {push}}} = this.props

    push(reactScreen(DialogScreen))
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
      <a onClick={this.showDialog}>{t_('show_dialog')}</a>
      <br />
      <a href={routes.getPath('about')}>{t_('about')}</a>
      <br />
      <a href={routes.getPath('registration')}>{t_('registration')}</a>
    </section>
  }
}
