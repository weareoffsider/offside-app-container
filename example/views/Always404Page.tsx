import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData, ExampleAppActions} from "../ExampleAppData"

export default class Always404Page extends React.Component<ExampleAppState, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    console.log("preloading")
    return actions.comms['placeholder'].get("/gruzzlepunk")
  }

  render () {
    const {l10n, routes} = this.props
    const t_ = l10n.translate

    return <section className="AboutPage">
      <h1>App Body in About Page</h1>
      <a href={routes.getPath('home')}>{t_('home')}</a>
    </section>
  }
}
