import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Footer extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n} = this.props
    const t_ = l10n.translate

    return <footer className="Footer">
      <p>{t_("footer")}</p>
      <p>{t_("location")}: {this.props.route.viewName}</p>
    </footer>
  }
}
