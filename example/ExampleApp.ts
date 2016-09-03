/// <reference path="../dist/offside-app-container.d.ts" />

import OffsideAppContainer, {UIContext} from "offside-app-container"

const app = new OffsideAppContainer()
const container = document.getElementById("app-container")

const mainUI = new UIContext("")
mainUI.setRenderOrder([
  "header",
  "views",
  "footer",
])

app.addUIContext("main", mainUI)
app.loadUIContext(container, "main")
