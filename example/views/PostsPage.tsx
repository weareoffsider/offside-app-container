import React from "react"
import ReactDOM from "react-dom"
import {ExampleAppState, UIChromeData, ExampleAppActions} from "../ExampleAppData"

export default class PostsPage extends React.Component<ExampleAppState, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    console.log("preloading")
    return actions.comms['placeholder'].get("/posts").then((data) => {
      return actions.business.storePosts(data)
    })
  }

  render () {
    const {l10n, routes, businessData} = this.props
    const t_ = l10n.translate

    const posts = businessData.postArray

    return <section className="PostsPage">
      <h1>App Body in Posts Page</h1>
      {posts.map((post) =>
        <article key={post.id}>
          <h2>{post.id} - {post.title}</h2>
          <p>{post.body}</p>
        </article>
      )}
      <a href={routes.getPath('home')}>{t_('home')}</a>
    </section>
  }
}
