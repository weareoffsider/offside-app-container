import React from "react"
import {UIData, UIChromeData} from "../ExampleAppData"

interface ChromeData {
}

export function initializeChrome (
  container: Element, props: UIData,
  chromeProps: UIChromeData
): ChromeData {
  container.textContent = "Header"
  return {}
}

export function updateChrome (
  container: Element, props: UIData,
  chromeProps: UIChromeData
): ChromeData {
  container.textContent = "Header"
  return {}
}
