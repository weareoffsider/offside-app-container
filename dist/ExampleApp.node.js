'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OffsideAppContainer = require('offsider-app-container');
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
            return React.createElement("header", { className: "Header", style: { marginBottom: "8rem" } }, React.createElement("h1", null, t_("app_title"), " ", uiData.title), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", { href: routes.getPath('home') }, t_('home'))), React.createElement("li", null, React.createElement("a", { href: routes.getPath('about') }, t_('about'))), React.createElement("li", null, React.createElement("a", { href: routes.getPath('posts') }, t_('posts'))), React.createElement("li", null, React.createElement("a", { href: routes.getPath('always404') }, t_('always404')))));
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

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
function reactScreen(ScreenComponent) {
    return {
        renderScreenGuard: ScreenComponent.renderScreenGuard,
        createScreen: function createScreen(container, state, appActions, screenProps) {
            ReactDOM.render(React.createElement(ScreenComponent, __assign({}, state, screenProps)), container);
            return {};
        },
        updateScreen: function updateScreen(container, state, appActions, screenProps) {
            ReactDOM.render(React.createElement(ScreenComponent, __assign({}, state, screenProps)), container);
            return {};
        },
        destroyScreen: function destroyScreen(container, data) {
            ReactDOM.unmountComponentAtNode(container);
        }
    };
}

var DialogScreen = function (_React$Component) {
    inherits(DialogScreen, _React$Component);

    function DialogScreen() {
        classCallCheck(this, DialogScreen);
        return possibleConstructorReturn(this, (DialogScreen.__proto__ || Object.getPrototypeOf(DialogScreen)).apply(this, arguments));
    }

    createClass(DialogScreen, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;
            var businessData = _props.businessData;
            var popScreen = _props.popScreen;

            var t_ = l10n.translate;
            return React.createElement("div", { className: "DialogScreen" }, React.createElement("h2", null, "Some Dialog"), React.createElement("p", null, "Hello everyone."), React.createElement("span", null, "The counter is ", businessData.counter, "."), React.createElement("a", { onClick: popScreen }, t_('dismiss')));
        }
    }], [{
        key: "renderScreenGuard",
        value: function renderScreenGuard(popFunc) {
            var screenGuard = document.createElement("div");
            screenGuard.classList.add('UIScreenGuard');
            screenGuard.addEventListener('click', popFunc);
            screenGuard.textContent = 'this is the screen guard';
            return screenGuard;
        }
    }]);
    return DialogScreen;
}(React.Component);

var Header$1 = function (_React$Component) {
    inherits(Header, _React$Component);

    function Header(props, context) {
        classCallCheck(this, Header);

        var _this = possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props, context));

        _this.showDialog = _this.showDialog.bind(_this);
        return _this;
    }

    createClass(Header, [{
        key: 'showDialog',
        value: function showDialog(e) {
            var push = this.props.actions.screenStack.push;

            push(reactScreen(DialogScreen));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;
            var businessData = _props.businessData;
            var actions = _props.actions;

            console.log(actions);
            var t_ = l10n.translate;
            return React.createElement("section", { className: "HomePage" }, React.createElement("h1", null, "App Body in Heyah"), React.createElement("button", { onClick: actions.ui.swapTitle }, t_('swap_title')), React.createElement("h3", null, "Counter"), React.createElement("button", { onClick: actions.business.decrement }, "-"), React.createElement("span", null, businessData.counter), React.createElement("button", { onClick: actions.business.increment }, "+"), React.createElement("br", null), React.createElement("a", { onClick: this.showDialog }, t_('show_dialog')), React.createElement("br", null), React.createElement("a", { href: routes.getPath('about') }, t_('about')), React.createElement("br", null), React.createElement("a", { href: routes.getPath('registration') }, t_('registration')));
        }
    }], [{
        key: 'preLoad',
        value: function preLoad(state, actions) {
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

var PostsPage = function (_React$Component) {
    inherits(PostsPage, _React$Component);

    function PostsPage() {
        classCallCheck(this, PostsPage);
        return possibleConstructorReturn(this, (PostsPage.__proto__ || Object.getPrototypeOf(PostsPage)).apply(this, arguments));
    }

    createClass(PostsPage, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;
            var businessData = _props.businessData;

            var t_ = l10n.translate;
            var posts = businessData.postArray;
            return React.createElement("section", { className: "PostsPage" }, React.createElement("h1", null, "App Body in Posts Page"), posts.map(function (post) {
                return React.createElement("article", { key: post.id }, React.createElement("h2", null, post.id, " - ", post.title), React.createElement("p", null, post.body));
            }), React.createElement("a", { href: routes.getPath('home') }, t_('home')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state, actions) {
            console.log("preloading");
            return actions.comms['placeholder'].get("/posts").then(function (data) {
                return actions.business.storePosts(data);
            });
        }
    }]);
    return PostsPage;
}(React.Component);

var FORM_KEY = "registration";
var STEP_KEY = "default";

var RegistrationPage = function (_React$Component) {
    inherits(RegistrationPage, _React$Component);

    function RegistrationPage(props, context) {
        classCallCheck(this, RegistrationPage);

        var _this = possibleConstructorReturn(this, (RegistrationPage.__proto__ || Object.getPrototypeOf(RegistrationPage)).call(this, props, context));

        _this.updateField = _this.updateField.bind(_this);
        _this.blurField = _this.blurField.bind(_this);
        _this.submitForm = _this.submitForm.bind(_this);
        return _this;
    }

    createClass(RegistrationPage, [{
        key: "updateField",
        value: function updateField(e) {
            var actions = this.props.actions;

            actions.forms.updateField(FORM_KEY, STEP_KEY, e.target.name, e.target.value);
        }
    }, {
        key: "blurField",
        value: function blurField(e) {
            var actions = this.props.actions;

            actions.forms.blurField(FORM_KEY, STEP_KEY, e.target.name);
        }
    }, {
        key: "submitForm",
        value: function submitForm(e) {
            e.preventDefault();
            var actions = this.props.actions;

            actions.forms.submitStep(FORM_KEY, STEP_KEY).then(function (data) {
                console.log(data, 'submit form');
            }, function (errors) {
                console.log(errors, 'error');
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;
            var forms = _props.forms;
            var businessData = _props.businessData;
            var actions = _props.actions;

            var formData = forms[FORM_KEY].steps[STEP_KEY].data;
            var errorData = forms[FORM_KEY].steps[STEP_KEY].errors;
            var warnData = forms[FORM_KEY].steps[STEP_KEY].warnings;
            var t_ = l10n.translate;
            console.log(errorData);
            return React.createElement("form", { onSubmit: this.submitForm, className: "HomePage" }, React.createElement("h1", null, t_('registration')), React.createElement("label", { htmlFor: "username" }, t_("username"), " ", React.createElement("br", null), React.createElement("input", { onChange: this.updateField, onBlur: this.blurField, id: "username", name: "username", value: formData.username }), errorData.username.length > 0 && React.createElement("p", { className: "error" }, errorData.username.join(' '))), React.createElement("br", null), React.createElement("br", null), React.createElement("label", { htmlFor: "email" }, t_("email"), " ", React.createElement("br", null), React.createElement("input", { onChange: this.updateField, onBlur: this.blurField, id: "email", type: "email", name: "email", value: formData.email }), errorData.email.length > 0 && React.createElement("p", { className: "error" }, errorData.email.join(' '))), React.createElement("br", null), React.createElement("br", null), React.createElement("label", { htmlFor: "password" }, t_("password"), " ", React.createElement("br", null), React.createElement("input", { onChange: this.updateField, onBlur: this.blurField, id: "password", type: "password", name: "password", value: formData.password }), errorData.password.length > 0 && React.createElement("p", { className: "error" }, errorData.password.join(' '))), React.createElement("br", null), React.createElement("br", null), React.createElement("label", { htmlFor: "magicword" }, t_("magicword"), " ", React.createElement("br", null), React.createElement("input", { onChange: this.updateField, onBlur: this.blurField, id: "magicword", type: "text", name: "magicword", value: formData.magicword }), errorData.magicword.length > 0 && React.createElement("p", { className: "error" }, errorData.magicword.join(' '))), React.createElement("br", null), React.createElement("br", null), React.createElement("button", { type: "submit" }, t_('submit_user')));
        }
    }], [{
        key: "preLoad",
        value: function preLoad(state, actions) {
            actions.forms.init(FORM_KEY);
            return Promise.resolve(true);
        }
    }]);
    return RegistrationPage;
}(React.Component);

var RegistrationForm = new OffsideAppContainer.FormDefinition("registration");
var registrationStep = new OffsideAppContainer.FormStepDefinition(STEP_KEY);
function magicWordProvided(value, formState) {
    console.log('magic word check', value);
    if (value != "please") {
        return Promise.reject(new OffsideAppContainer.FormError("You didn't say the magic word."));
    }
    return Promise.resolve(true);
}
RegistrationForm.addStep(STEP_KEY, registrationStep);
registrationStep.addField("username", new OffsideAppContainer.FormFieldDefinition("text", true, OffsideAppContainer.FormValidationStyle.OnBlur));
registrationStep.addField("email", new OffsideAppContainer.FormFieldDefinition("email", true, OffsideAppContainer.FormValidationStyle.WhileEditing));
registrationStep.addField("password", new OffsideAppContainer.FormFieldDefinition("password", true, OffsideAppContainer.FormValidationStyle.WhileEditing));
registrationStep.addField("magicword", new OffsideAppContainer.FormFieldDefinition("magicword", true, OffsideAppContainer.FormValidationStyle.OnStepEnd, [magicWordProvided]));

var NotFoundPage = function (_React$Component) {
    inherits(NotFoundPage, _React$Component);

    function NotFoundPage() {
        classCallCheck(this, NotFoundPage);
        return possibleConstructorReturn(this, (NotFoundPage.__proto__ || Object.getPrototypeOf(NotFoundPage)).apply(this, arguments));
    }

    createClass(NotFoundPage, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;

            var t_ = l10n.translate;
            console.log("render NotFoundPage");
            return React.createElement("section", { className: "NotFoundPage" }, React.createElement("h1", null, "404"), React.createElement("p", null, "Your page could not be found"), React.createElement("a", { href: routes.getPath('home') }, t_('home')));
        }
    }]);
    return NotFoundPage;
}(React.Component);

var OfflinePage = function (_React$Component) {
    inherits(OfflinePage, _React$Component);

    function OfflinePage() {
        classCallCheck(this, OfflinePage);
        return possibleConstructorReturn(this, (OfflinePage.__proto__ || Object.getPrototypeOf(OfflinePage)).apply(this, arguments));
    }

    createClass(OfflinePage, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var l10n = _props.l10n;
            var routes = _props.routes;

            var t_ = l10n.translate;
            return React.createElement("section", { className: "NotFoundPage" }, React.createElement("h1", null, "Offline"), React.createElement("p", null, "Your connection is offline."), React.createElement("a", { href: routes.getPath('home') }, t_('home')));
        }
    }]);
    return OfflinePage;
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

var __assign$1 = undefined && undefined.__assign || Object.assign || function (t) {
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
        createChrome: function createChrome(container, state, chromeState, appActions) {
            ReactDOM.render(React.createElement(ChromeComponent, __assign$1({}, state, chromeState)), container);
            return {};
        },
        updateChrome: function updateChrome(container, state, chromeState, appActions) {
            ReactDOM.render(React.createElement(ChromeComponent, __assign$1({}, state, chromeState)), container);
            return {};
        },
        destroyChrome: function destroyChrome(container, data) {
            ReactDOM.unmountComponentAtNode(container);
        }
    };
}

var __assign$2 = undefined && undefined.__assign || Object.assign || function (t) {
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
            ReactDOM.render(React.createElement(ViewComponent, __assign$2({}, state, { actions: actions })), container);
            return {};
        },

        updateChrome: ViewComponent.updateChrome,
        updateView: function updateView(container, state, actions, data) {
            ReactDOM.render(React.createElement(ViewComponent, __assign$2({}, state, { actions: actions })), container);
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
function postArray() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'STORE_POSTS':
            return action.posts;
        default:
            return state;
    }
}
var reducer = redux.combineReducers({
    counter: counter,
    postArray: postArray
});
function setupBusinessStore(app) {
    var store = redux.createStore(reducer, window.devToolsExtension && window.devToolsExtension());
    store.subscribe(function () {
        app.updateAppState("businessData", store.getState());
    });
    return store.dispatch.bind(store);
}
var businessActions = {
    init: function init() {
        this.businessDispatch({ type: 'INIT' });
    },
    storePosts: function storePosts(posts) {
        this.businessDispatch({ type: 'STORE_POSTS', posts: posts });
    },
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
app.addForm(RegistrationForm);
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
mainUI.addView("posts", reactView(PostsPage));
mainUI.addView("registration", reactView(RegistrationPage));
mainUI.addView("always404", reactView(Always404Page));
mainUI.addView("**404", reactView(NotFoundPage));
mainUI.addView("**offline", reactView(OfflinePage));
mainUI.addRoute("/", "home");
mainUI.addRoute("/about", "about");
mainUI.addRoute("/posts", "posts");
mainUI.addRoute("/registration", "registration");
mainUI.addRoute("/always404", "always404");
app.addUIContext("main", mainUI);
app.setupLocalisation({
    en: enLang
});
app.loadUIContext("main");
app.initializeAppState("en", {
    counter: 0,
    postArray: []
}, {
    title: "Start Title"
}, {
    showHeader: true,
    showFooter: true
});
app.initializeUI(container);