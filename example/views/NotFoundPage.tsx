import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class NotFoundPage extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n, routes} = this.props
    const t_ = l10n.translate
    console.log("render NotFoundPage")

    return <section className="NotFoundPage">
      <h1>404</h1>
      <p>Your page could not be found</p>
      <a href={routes.getPath('home')}>{t_('home')}</a>
    </section>
  }
}
