'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OffsideAppContainer = require('offside-app-container');
var OffsideAppContainer__default = _interopDefault(OffsideAppContainer);

/// <reference path="../dist/offside-app-container.d.ts" />
var app = new OffsideAppContainer__default();
var container = document.getElementById("app-container");
var mainUI = new OffsideAppContainer.UIContext("");
mainUI.setRenderOrder(["header", "views", "footer"]);
app.addUIContext("main", mainUI);
app.loadUIContext(container, "main");