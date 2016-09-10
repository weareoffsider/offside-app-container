import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Footer extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n} = this.props
    const t_ = l10n.translate

    return <footer className="Footer" style={{marginTop: "8rem"}}>
      <p>{t_("footer")}</p>
      <p>{t_("location")}: {this.props.route.viewName}</p>
      <p>{t_("connection")}: {this.props.comms['placeholder'].statusString}</p>
    </footer>
  }
}
