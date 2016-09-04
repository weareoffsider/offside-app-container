import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Header extends React.Component<ExampleAppState, any> {
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
    const {l10n, routes} = this.props
    const t_ = l10n.translate

    return <section className="HomePage">
      <h1>App Body in Heyah</h1>
      <a href={routes.getPath('about')}>{t_('about')}</a>
    </section>
  }
}
