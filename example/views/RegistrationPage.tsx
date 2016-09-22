import React from "react"
import ReactDOM from "react-dom"
import {
  ExampleAppProps, ExampleAppState, UIChromeData,
  ExampleAppActions
} from "../ExampleAppData"

export default class RegistrationPage extends React.Component<ExampleAppProps, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    return Promise.resolve(true);
  }

  render () {
    const {l10n, routes, businessData, actions} = this.props
    const t_ = l10n.translate

    return <section className="HomePage">
      <h1>{t_('registration')}</h1>
    </section>
  }
}
