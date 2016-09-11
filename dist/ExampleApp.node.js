'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OffsideAppContainer = require('offside-app-container');
var OffsideAppContainer__default = _interopDefault(OffsideAppContainer);
var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var redux = require('redux');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Header = function (_React$Component) {
    inherits(Header, _React$Component);

    function Header() {
        classCallCheck(this, Header);
        return possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    createClass(Header, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var uiData = _props.uiData;
            var routes = _props.routes;

            var t_ = l10n.translate;
            return React.createElement("header", { className: "Header", style: { marginBottom: "8rem" } }, React.createElement("h1", null, t_("app_title"), " ", uiData.title), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", { href: routes.getPath('home') }, t_('home'))), React.createElement("li", null, React.createElement("a", { href: routes.getPath('about') }, t_('about'))), React.createElement("li", null, React.createElement("a", { href: routes.getPath('always404') }, t_('always404')))));
        }
    }]);
    return Header;
}(React.Component);

var Footer = function (_React$Component) {
    inherits(Footer, _React$Component);

    function Footer() {
        classCallCheck(this, Footer);
        return possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    createClass(Footer, [{
        key: "render",
        value: function render() {
            var l10n = this.props.l10n;

            var t_ = l10n.translate;
            return React.createElement("footer", { className: "Footer", style: { marginTop: "8rem" } }, React.createElement("p", null, t_("footer")), React.createElement("p", null, t_("location"), ": ", this.props.route.viewName), React.createElement("p", null, t_("connection"), ": ", this.props.comms['placeholder'].statusString));
        }
    }]);
    return Footer;
}(React.Component);

var Header$1 = function (_React$Component) {
    inherits(Header, _React$Component);

    function Header() {
        classCallCheck(this, Header);
        return possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    createClass(Header, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;
            var businessData = _props.businessData;
            var actions = _props.actions;

            var t_ = l10n.translate;
            return React.createElement("section", { className: "HomePage" }, React.createElement("h1", null, "App Body in Heyah"), React.createElement("button", { onClick: actions.ui.swapTitle }, t_('swap_title')), React.createElement("h3", null, "Counter"), React.createElement("button", { onClick: actions.business.decrement }, "-"), React.createElement("span", null, businessData), React.createElement("button", { onClick: actions.business.increment }, "+"), React.createElement("br", null), React.createElement("br", null), React.createElement("a", { href: routes.getPath('about') }, t_('about')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state, actions) {
            console.log("preloading");
            return actions.comms['placeholder'].get("/posts/1");
        }
    }]);
    return Header;
}(React.Component);

var AboutPage = function (_React$Component) {
    inherits(AboutPage, _React$Component);

    function AboutPage() {
        classCallCheck(this, AboutPage);
        return possibleConstructorReturn(this, (AboutPage.__proto__ || Object.getPrototypeOf(AboutPage)).apply(this, arguments));
    }

    createClass(AboutPage, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;

            var t_ = l10n.translate;
            return React.createElement("section", { className: "AboutPage" }, React.createElement("h1", null, "App Body in About Page"), React.createElement("a", { href: routes.getPath('home') }, t_('home')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state) {
            console.log("would preload here");
            return Promise.resolve(true);
        }
    }]);
    return AboutPage;
}(React.Component);

var Always404Page = function (_React$Component) {
    inherits(Always404Page, _React$Component);

    function Always404Page() {
        classCallCheck(this, Always404Page);
        return possibleConstructorReturn(this, (Always404Page.__proto__ || Object.getPrototypeOf(Always404Page)).apply(this, arguments));
    }

    createClass(Always404Page, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;

            var t_ = l10n.translate;
            return React.createElement("section", { className: "AboutPage" }, React.createElement("h1", null, "App Body in About Page"), React.createElement("a", { href: routes.getPath('home') }, t_('home')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state, actions) {
            console.log("preloading");
            return actions.comms['placeholder'].get("/gruzzlepunk");
        }
    }]);
    return Always404Page;
}(React.Component);

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
function reactChrome(ChromeComponent) {
    return {
        initializeChrome: function initializeChrome(container, state, chromeState, appActions) {
            ReactDOM.render(React.createElement(ChromeComponent, __assign({}, state, chromeState)), container);
            return {};
        },
        updateChrome: function updateChrome(container, state, chromeState, appActions) {
            ReactDOM.render(React.createElement(ChromeComponent, __assign({}, state, chromeState)), container);
            return {};
        }
    };
}

var __assign$1 = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
function reactView(ViewComponent) {
    return {
        preLoad: ViewComponent.preLoad,
        postLoad: ViewComponent.postLoad,
        createView: function createView(container, state, actions) {
            ReactDOM.render(React.createElement(ViewComponent, __assign$1({}, state, { actions: actions })), container);
            return {};
        },

        updateChrome: ViewComponent.updateChrome,
        updateView: function updateView(container, state, actions, data) {
            ReactDOM.render(React.createElement(ViewComponent, __assign$1({}, state, { actions: actions })), container);
            return {};
        },
        destroyView: function destroyView(container, data) {
            ReactDOM.unmountComponentAtNode(container);
        }
    };
}

function counter() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
function setupBusinessStore(app) {
    var store = redux.createStore(counter, window.devToolsExtension && window.devToolsExtension());
    store.subscribe(function () {
        app.updateAppState("businessData", store.getState());
    });
    return store.dispatch.bind(store);
}
var businessActions = {
    increment: function increment() {
        this.businessDispatch({ type: 'INCREMENT' });
    },
    decrement: function decrement() {
        this.businessDispatch({ type: 'DECREMENT' });
    }
};

var defaultState = {
    title: "Start Title"
};
function swapper() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'SWAP_TITLE':
            return state.title === "Start Title" ? { title: "Other Title" } : { title: "Start Title" };
        default:
            return state;
    }
}
function setupUiStore(app) {
    var store = redux.createStore(swapper, window.devToolsExtension && window.devToolsExtension());
    store.subscribe(function () {
        app.updateAppState("uiData", store.getState());
    });
    return store.dispatch.bind(store);
}
var uiActions = {
    swapTitle: function swapTitle() {
        this.uiDispatch({ type: 'SWAP_TITLE' });
    }
};

/// <reference path="../dist/offside-app-container.d.ts" />
var enLang = require("json!./translation.json");
var app = new OffsideAppContainer__default();
var container = document.getElementById("app-container");
app.setBusinessDispatch(setupBusinessStore(app));
app.setBusinessActions(businessActions);
app.setUiDispatch(setupUiStore(app));
app.setUiActions(uiActions);
var placeholderComms = new OffsideAppContainer.CommsChannel("placeholder", "http://jsonplaceholder.typicode.com", {}, function (req) {
    return;
}, function (req) {
    return JSON.parse(req.responseText);
});
app.addCommsChannel(placeholderComms);
var mainUI = new OffsideAppContainer.UIContext("");
mainUI.addChrome("header", reactChrome(Header));
mainUI.addChrome("footer", reactChrome(Footer));
mainUI.setRenderOrder(["header", "**views", "footer"]);
mainUI.addView("home", reactView(Header$1));
mainUI.addView("about", reactView(AboutPage));
mainUI.addView("always404", reactView(Always404Page));
// mainUI.addView("**404", reactView(NotFoundPage))
// mainUI.addView("**offline", reactView(OfflinePage))
mainUI.addRoute("/", "home");
mainUI.addRoute("/about", "about");
mainUI.addRoute("/always404", "always404");
app.addUIContext("main", mainUI);
app.setupLocalisation({
    en: enLang
});
app.loadUIContext("main");
app.initializeAppState("en", 0, {
    title: "Start Title"
}, {
    showHeader: true,
    showFooter: true
});
app.initializeUI(container);