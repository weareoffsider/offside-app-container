/// <reference path="../dist/offside-app-container.d.ts" />

import OffsideAppContainer, {UIContext} from "offside-app-container"
import Header from "./chrome/Header"
import Footer from "./chrome/Footer"
import HomePage from "./views/HomePage"
import AboutPage from "./views/AboutPage"
import reactChrome from "./reactChrome"
import reactView from "./reactView"
const enLang = require("json!./translation.json")
import {BusinessData, UIData, UIChromeData} from "./ExampleAppData"

const app = new OffsideAppContainer<BusinessData, UIData, UIChromeData>()
const container = document.getElementById("app-container")

const mainUI = new UIContext<BusinessData, UIData, UIChromeData, any, any>("")
mainUI.addChrome("header", reactChrome(Header))
mainUI.addChrome("footer", reactChrome(Footer))
mainUI.setRenderOrder([
  "header",
  "**views",
  "footer",
])

mainUI.addView("home", reactView(HomePage))
mainUI.addView("about", reactView(AboutPage))

mainUI.addRoute("/", "home")
mainUI.addRoute("/about", "about")

app.addUIContext("main", mainUI)
app.setupLocalisation({
  en: enLang,
})

app.loadUIContext("main")

app.initializeAppState(
  "en",
  {},
  {
    title: "Start Title",
  }, {
    showHeader: true,
    showFooter: true,
  }
)

app.initializeUI(container)
