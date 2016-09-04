/// <reference path="../dist/offside-app-container.d.ts" />

import OffsideAppContainer, {UIContext} from "offside-app-container"
import * as header from "./chrome/Header"
import * as footer from "./chrome/Footer"


const app = new OffsideAppContainer()
const container = document.getElementById("app-container")

const mainUI = new UIContext("")
mainUI.addChrome("header", header)
mainUI.addChrome("footer", footer)
mainUI.setRenderOrder([
  "header",
  "**views",
  "footer",
])

app.addUIContext("main", mainUI)
app.loadUIContext("main")
app.initializeUI(container, {
  title: "Start Title",
}, {
  showHeader: true,
  showFooter: true,
})
