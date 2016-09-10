/// <reference path="../dist/offside-app-container.d.ts" />

import OffsideAppContainer, {UIContext, CommsChannel} from "offside-app-container"
import Header from "./chrome/Header"
import Footer from "./chrome/Footer"
import HomePage from "./views/HomePage"
import AboutPage from "./views/AboutPage"
import reactChrome from "./reactChrome"
import reactView from "./reactView"
const enLang = require("json!./translation.json")
import {BusinessData, UIData, UIChromeData} from "./ExampleAppData"
import setupBusinessStore, {businessActions} from "./BusinessStore"
import setupUiStore, {uiActions} from "./UIStore"

const app = new OffsideAppContainer<BusinessData, UIData, UIChromeData, any, any>()
const container = document.getElementById("app-container")

app.setBusinessDispatch(setupBusinessStore(app))
app.setBusinessActions(businessActions)

app.setUiDispatch(setupUiStore(app))
app.setUiActions(uiActions)

const placeholderComms = new CommsChannel<any>(
  "placeholder",
  "http://jsonplaceholder.typicode.com",
  {},
  function (req: XMLHttpRequest) {
    return
  },
  function (req: XMLHttpRequest) {
    return JSON.parse(req.responseText)
  },
  function (req: XMLHttpRequest) {
    return JSON.parse(req.responseText)
  }
)

app.addCommsChannel(placeholderComms)

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
  0,
  {
    title: "Start Title",
  }, {
    showHeader: true,
    showFooter: true,
  }
)

app.initializeUI(container)
