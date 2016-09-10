import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Header extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n, uiData} = this.props
    const t_ = l10n.translate

    return <header className="Header">
      <h1>{t_("app_title")} {uiData.title}</h1>
    </header>
  }
}
