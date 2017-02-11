import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData} from "../ExampleAppData"

export default class Header extends React.Component<ExampleAppState, any> {
  render () {
    const {l10n, uiData, routes} = this.props
    const t_ = l10n.translate

    return <header className="Header" style={{marginBottom: "8rem"}}>
      <h1>{t_("app_title")} {uiData.title}</h1>
      <ul>
        <li><a href={routes.getPath('home')}>{t_('home')}</a></li>
        <li><a href={routes.getPath('about')}>{t_('about')}</a></li>
        <li><a href={routes.getPath('posts')}>{t_('posts')}</a></li>
        <li><a href={routes.getPath('always404')}>{t_('always404')}</a></li>
      </ul>

    </header>
  }
}
