'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OffsideAppContainer = require('offside-app-container');
var OffsideAppContainer__default = _interopDefault(OffsideAppContainer);

function initializeChrome(container, props, chromeProps) {
    container.textContent = "Header";
    return {};
}
function updateChrome(container, props, chromeProps) {
    container.textContent = "Header";
    return {};
}

var header = Object.freeze({
    initializeChrome: initializeChrome,
    updateChrome: updateChrome
});

function initializeChrome$1(container, props, chromeProps) {
    container.textContent = "Footer";
    return {};
}
function updateChrome$1(container, props, chromeProps) {
    container.textContent = "Footer";
    return {};
}

var footer = Object.freeze({
    initializeChrome: initializeChrome$1,
    updateChrome: updateChrome$1
});

/// <reference path="../dist/offside-app-container.d.ts" />
var app = new OffsideAppContainer__default();
var container = document.getElementById("app-container");
var mainUI = new OffsideAppContainer.UIContext("");
mainUI.addChrome("header", header);
mainUI.addChrome("footer", footer);
mainUI.setRenderOrder(["header", "**views", "footer"]);
app.addUIContext("main", mainUI);
app.loadUIContext("main");
app.initializeUI(container, {
    title: "Start Title"
}, {
    showHeader: true,
    showFooter: true
});