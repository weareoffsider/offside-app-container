'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OffsideAppContainer = require('offside-app-container');
var OffsideAppContainer__default = _interopDefault(OffsideAppContainer);
var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));

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
            var l10n = this.props.l10n;

            var t_ = l10n.translate;
            return React.createElement("header", { className: "Header" }, React.createElement("h1", null, t_("app_title")));
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
            return React.createElement("footer", { className: "Footer" }, React.createElement("p", null, t_("footer")), React.createElement("p", null, t_("location"), ": ", this.props.route.viewName));
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

            var t_ = l10n.translate;
            return React.createElement("section", { className: "HomePage" }, React.createElement("h1", null, "App Body in Heyah"), React.createElement("a", { href: routes.getPath('about') }, t_('about')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state) {
            console.log("preloading");
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    console.log("resolving preload");
                    resolve(true);
                }, 2000);
            });
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
        initializeChrome: function initializeChrome(container, state, chromeState) {
            ReactDOM.render(React.createElement(ChromeComponent, __assign({}, state, chromeState)), container);
            return {};
        },
        updateChrome: function updateChrome(container, state, chromeState) {
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
        createView: function createView(container, state) {
            ReactDOM.render(React.createElement(ViewComponent, __assign$1({}, state)), container);
            return {};
        },

        updateChrome: ViewComponent.updateChrome,
        updateView: function updateView(container, state, data) {
            ReactDOM.render(React.createElement(ViewComponent, __assign$1({}, state)), container);
            return {};
        },
        destroyView: function destroyView(container, state, data) {
            ReactDOM.unmountComponentAtNode(container);
        }
    };
}

/// <reference path="../dist/offside-app-container.d.ts" />
var enLang = require("json!./translation.json");
var app = new OffsideAppContainer__default();
var container = document.getElementById("app-container");
var mainUI = new OffsideAppContainer.UIContext("");
mainUI.addChrome("header", reactChrome(Header));
mainUI.addChrome("footer", reactChrome(Footer));
mainUI.setRenderOrder(["header", "**views", "footer"]);
mainUI.addView("home", reactView(Header$1));
mainUI.addView("about", reactView(AboutPage));
mainUI.addRoute("/", "home");
mainUI.addRoute("/about", "about");
app.addUIContext("main", mainUI);
app.setupLocalisation({
    en: enLang
});
app.loadUIContext("main");
app.initializeAppState("en", {}, {
    title: "Start Title"
}, {
    showHeader: true,
    showFooter: true
});
app.initializeUI(container);