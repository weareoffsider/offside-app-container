import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class OfflinePage extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n, routes} = this.props
    const t_ = l10n.translate

    return <section className="NotFoundPage">
      <h1>Offline</h1>
      <p>Your connection is offline.</p>
      <a href={routes.getPath('home')}>{t_('home')}</a>
    </section>
  }
}
