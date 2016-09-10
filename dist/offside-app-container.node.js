'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var i18next = require('i18next');
var moment = require('moment');
var Route = _interopDefault(require('route-parser'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

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

var LocalizeSpawner = function () {
    function LocalizeSpawner(translationResources) {
        classCallCheck(this, LocalizeSpawner);

        this.translationResources = translationResources;
    }

    createClass(LocalizeSpawner, [{
        key: 'loadLocale',
        value: function loadLocale(langCode) {
            var i18n = i18next.init({
                lng: langCode,
                resources: this.translationResources,
                parseMissingKeyHandler: function parseMissingKeyHandler(key) {
                    console.log("langCode missing: ", key);
                    return "{l10n absent: " + key + "}";
                }
            });
            var localMoment = moment().locale(langCode);
            return new LocalizeContext(langCode, i18n);
        }
    }]);
    return LocalizeSpawner;
}();

var LocalizeContext = function () {
    function LocalizeContext(langCode, i18n) {
        classCallCheck(this, LocalizeContext);

        this.langCode = langCode;
        this.i18n = i18n;
        this.translate = this.translate.bind(this);
        this.customDatetime = this.customDatetime.bind(this);
        this.time = this.time.bind(this);
        this.fullDatetime = this.fullDatetime.bind(this);
        this.abbrDatetime = this.abbrDatetime.bind(this);
        this.fullDate = this.fullDate.bind(this);
        this.abbrDate = this.abbrDate.bind(this);
        this.numericDate = this.numericDate.bind(this);
    }

    createClass(LocalizeContext, [{
        key: 'translate',
        value: function translate(key, params) {
            return this.i18n.t(key, params);
        }
    }, {
        key: 'formatMoment',
        value: function formatMoment(datetime, format) {
            return moment(datetime).locale(this.langCode).format(format);
        }
    }, {
        key: 'customDatetime',
        value: function customDatetime(datetime, format) {
            return this.formatMoment(datetime, format);
        }
    }, {
        key: 'time',
        value: function time(datetime) {
            return this.formatMoment(datetime, "LT");
        }
    }, {
        key: 'fullDatetime',
        value: function fullDatetime(datetime) {
            return this.formatMoment(datetime, "LLL");
        }
    }, {
        key: 'abbrDatetime',
        value: function abbrDatetime(datetime) {
            return this.formatMoment(datetime, "lll");
        }
    }, {
        key: 'fullDate',
        value: function fullDate(datetime) {
            return this.formatMoment(datetime, "LL");
        }
    }, {
        key: 'abbrDate',
        value: function abbrDate(datetime) {
            return this.formatMoment(datetime, "ll");
        }
    }, {
        key: 'numericDate',
        value: function numericDate(datetime) {
            return this.formatMoment(datetime, "L");
        }
    }]);
    return LocalizeContext;
}();

var CommsChannelStatus;
(function (CommsChannelStatus) {
    CommsChannelStatus[CommsChannelStatus["Offline"] = 0] = "Offline";
    CommsChannelStatus[CommsChannelStatus["Idle"] = 1] = "Idle";
    CommsChannelStatus[CommsChannelStatus["Active"] = 2] = "Active";
})(CommsChannelStatus || (CommsChannelStatus = {}));

var CommsChannel = function () {
    function CommsChannel(name, urlRoot, commData, prepareRequest, processSuccess, processError) {
        classCallCheck(this, CommsChannel);

        this.name = name;
        this.urlRoot = urlRoot;
        this.commData = commData;
        this.prepareRequest = prepareRequest;
        this.processSuccess = processSuccess;
        this.processError = processError;
        this.nextRequestKey = 0;
        this.state = {
            requests: [],
            status: CommsChannelStatus.Idle,
            statusString: CommsChannelStatus[CommsChannelStatus.Idle]
        };
    }

    createClass(CommsChannel, [{
        key: "setStateSetter",
        value: function setStateSetter(func) {
            this.updateCommsState = func;
        }
    }, {
        key: "getState",
        value: function getState() {
            return this.state;
        }
    }, {
        key: "updateRequestState",
        value: function updateRequestState(key, request) {
            var nextRequests = this.state.requests.slice();
            var status = void 0;
            nextRequests[key] = request;
            if (this.state.status === CommsChannelStatus.Offline) {
                if (request.status !== 0 && request.progress === 1) {
                    if (nextRequests.every(function (r) {
                        return r.progress === 1;
                    })) {
                        status = CommsChannelStatus.Idle;
                    } else {
                        status = CommsChannelStatus.Active;
                    }
                } else {
                    status = CommsChannelStatus.Offline;
                }
            } else {
                if (request.status === 0) {
                    status = CommsChannelStatus.Offline;
                } else if (nextRequests.every(function (r) {
                    return r.progress === 1;
                })) {
                    status = CommsChannelStatus.Idle;
                } else {
                    status = CommsChannelStatus.Active;
                }
            }
            this.state = {
                requests: nextRequests, status: status,
                statusString: CommsChannelStatus[status]
            };
            this.updateCommsState(this.name, this.state);
        }
    }, {
        key: "get",
        value: function get(url) {
            var _this = this;

            var key = this.nextRequestKey++;
            return new Promise(function (resolve, reject) {
                console.log("comms :: " + _this.name + " :: get - " + url);
                var req = new XMLHttpRequest();
                _this.updateRequestState(key, { url: url, progress: 0 });
                req.addEventListener("load", function () {
                    if (req.status >= 400) {
                        var result = _this.processError(req, _this.commData);
                        _this.updateRequestState(key, { url: url, status: req.status,
                            progress: 1, result: result });
                        reject(result);
                    } else {
                        var _result = _this.processSuccess(req, _this.commData);
                        _this.updateRequestState(key, { url: url, status: req.status,
                            progress: 1, result: _result });
                        resolve(_result);
                    }
                }, false);
                req.addEventListener("error", function () {
                    var result = _this.processError(req, _this.commData);
                    _this.updateRequestState(key, { url: url, status: 0, progress: 1, result: result });
                    reject(result);
                }, false);
                req.open("GET", "" + _this.urlRoot + url);
                _this.prepareRequest(req, _this.commData);
                req.send();
            });
        }
    }, {
        key: "actions",
        value: function actions() {
            return {
                get: this.get.bind(this)
            };
        }
    }]);
    return CommsChannel;
}();

var AppActor = function () {
    function AppActor() {
        classCallCheck(this, AppActor);
    }

    createClass(AppActor, [{
        key: "setStateGetter",
        value: function setStateGetter(func) {
            this.getAppState = func;
        }
    }, {
        key: "setBusinessDispatch",
        value: function setBusinessDispatch(func) {
            this.businessDispatch = func;
        }
    }, {
        key: "setUiDispatch",
        value: function setUiDispatch(func) {
            this.uiDispatch = func;
        }
    }]);
    return AppActor;
}();

var ViewDefinition = function () {
    function ViewDefinition(options) {
        classCallCheck(this, ViewDefinition);

        this.options = options;
    }

    createClass(ViewDefinition, [{
        key: "spawnView",
        value: function spawnView(container, route) {
            return new View(container, route, this.options);
        }
    }]);
    return ViewDefinition;
}();

var View = function () {
    function View(container, route, options) {
        classCallCheck(this, View);

        this.container = container;
        this.route = route;
        this.options = options;
    }

    createClass(View, [{
        key: "preLoadData",
        value: function preLoadData(state, actions) {
            var _this = this;

            return (this.options.preLoad ? this.options.preLoad(state, actions) : Promise.resolve(true)).then(function (value) {
                _this.loaded = true;
                return value;
            });
        }
    }, {
        key: "postLoadData",
        value: function postLoadData(state, actions) {
            return this.options.postLoad ? this.options.postLoad(state, actions) : Promise.resolve(true);
        }
    }, {
        key: "create",
        value: function create(state, chromeData, actions) {
            if (!this.loaded) {
                return chromeData;
            }
            this.viewData = this.options.createView(this.container, state, actions);
            return this.options.updateChrome ? this.options.updateChrome(state, chromeData, this.viewData) : chromeData;
        }
    }, {
        key: "update",
        value: function update(state, chromeData, actions) {
            if (!this.loaded) {
                return chromeData;
            }
            this.viewData = this.options.updateView(this.container, state, actions, this.viewData);
            return this.options.updateChrome ? this.options.updateChrome(state, chromeData, this.viewData) : chromeData;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.options.destroyView(this.container, this.viewData);
            this.container.parentNode.removeChild(this.container);
        }
    }]);
    return View;
}();

var ChromeDefinition = function () {
    function ChromeDefinition(options) {
        classCallCheck(this, ChromeDefinition);

        this.options = options;
    }

    createClass(ChromeDefinition, [{
        key: "getOptions",
        value: function getOptions() {
            return this.options;
        }
    }]);
    return ChromeDefinition;
}();

var Chrome = function () {
    function Chrome(container, options) {
        classCallCheck(this, Chrome);

        this.container = container;
        this.options = options;
    }

    createClass(Chrome, [{
        key: "initialize",
        value: function initialize(state, chromeProps, actions) {
            this.chromeData = this.options.initializeChrome(this.container, state, chromeProps, actions);
        }
    }, {
        key: "update",
        value: function update(state, chromeProps, actions) {
            this.chromeData = this.options.updateChrome(this.container, state, chromeProps, actions, this.chromeData);
        }
    }]);
    return Chrome;
}();

/* RouteTable
 *
 * A class for managing a set of path routes in the UI Context. View names
 * must correlate to Views in this UI Context's ViewSet.
 */

var RouteTable = function () {
    function RouteTable() {
        var routeBase = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
        classCallCheck(this, RouteTable);

        this.routeBase = routeBase;
        this.routes = [];
    }
    // add a route to the set, they are parsed in sequence so higher
    // priority routes should be added first


    createClass(RouteTable, [{
        key: "addRoute",
        value: function addRoute(routePath, viewName, routeName) {
            var route = new RouteMatcher(routePath, viewName, routeName);
            this.routes.push(route);
        }
        // take a path and match it to a route, otherwise returning null

    }, {
        key: "matchPath",
        value: function matchPath(fullPath) {
            var scopedPath = fullPath.replace(this.routeBase, "");
            var match = this.routes.find(function (route) {
                return route.match(scopedPath);
            });
            return match ? match : null;
        }
        // get a path from a provided routeName and parameters

    }, {
        key: "getPath",
        value: function getPath(routeName, params) {
            if (!params) {
                params = {};
            }
            var route = this.routes.find(function (route) {
                return route.routeName == routeName;
            });
            if (route) {
                return "" + this.routeBase + route.reverse(params);
            } else {
                return "/route-not-found";
            }
        }
    }]);
    return RouteTable;
}();

var RouteMatcher = function () {
    function RouteMatcher(route, viewName, routeName) {
        classCallCheck(this, RouteMatcher);

        if (route && viewName) {
            this.routeMatcher = new Route(route);
            this.viewName = viewName;
            this.routeName = routeName ? routeName : viewName;
        }
    }

    createClass(RouteMatcher, [{
        key: "attachPath",
        value: function attachPath(path) {
            var matcher = new RouteMatcher();
            matcher.routeMatcher = this.routeMatcher;
            matcher.viewName = this.viewName;
            matcher.routeName = this.routeName;
            matcher.path = path;
            return matcher;
        }
    }, {
        key: "match",
        value: function match(path) {
            return this.routeMatcher.match(path);
        }
    }, {
        key: "reverse",
        value: function reverse(params) {
            return this.routeMatcher.reverse(params);
        }
    }]);
    return RouteMatcher;
}();

var UIContext = function () {
    function UIContext(urlBase) {
        classCallCheck(this, UIContext);

        this.viewSet = {};
        this.chromeSet = {};
        this.activeChrome = {};
        this.visibleViews = {};
        this.routeTable = new RouteTable();
    }

    createClass(UIContext, [{
        key: 'addView',
        value: function addView(key, viewOptions) {
            this.viewSet[key] = new ViewDefinition(viewOptions);
        }
    }, {
        key: 'addChrome',
        value: function addChrome(key, chromeOptions) {
            this.chromeSet[key] = new ChromeDefinition(chromeOptions);
        }
    }, {
        key: 'addRoute',
        value: function addRoute(routePath, viewName, routeName) {
            this.routeTable.addRoute(routePath, viewName, routeName);
        }
    }, {
        key: 'getMatchFromRoute',
        value: function getMatchFromRoute(path) {
            var match = this.routeTable.matchPath(path);
            return match ? match.attachPath(path) : null;
        }
    }, {
        key: 'setRenderOrder',
        value: function setRenderOrder(newOrder) {
            this.renderOrder = newOrder;
        }
    }, {
        key: 'setContextKey',
        value: function setContextKey(contextKey) {
            this.contextKey = contextKey;
        }
    }, {
        key: 'setStateGetter',
        value: function setStateGetter(getter) {
            this.getLatestAppState = getter;
        }
    }, {
        key: 'initialize',
        value: function initialize(container, props, chromeProps, appActions) {
            var _this = this;

            console.log("UIContext INIT", this.renderOrder, this.chromeSet, this.viewSet, props);
            this.chromeState = chromeProps;
            this.renderOrder.forEach(function (name) {
                if (name !== "**views") {
                    var chromeContainer = document.createElement("div");
                    chromeContainer.id = _this.contextKey + '-' + name;
                    container.appendChild(chromeContainer);
                    _this.activeChrome[name] = new Chrome(chromeContainer, _this.chromeSet[name].getOptions());
                    _this.activeChrome[name].initialize(props, chromeProps, appActions);
                } else {
                    console.log("render root");
                    var viewsContainer = document.createElement("div");
                    viewsContainer.id = _this.contextKey + '-viewsContainer';
                    container.appendChild(viewsContainer);
                    _this.viewContainer = viewsContainer;
                }
            });
            if (props.route) {
                this.loadRoute(props.route, props, chromeProps, appActions);
            }
        }
    }, {
        key: 'update',
        value: function update(state, appActions) {
            var _this2 = this;

            if (state.route.path !== this.activeView.route.path) {
                this.loadRoute(state.route, state, this.chromeState, appActions);
                // loadRoute promises may mutate the state, so recollect
                // state to ensure it's up to date
                state = this.getLatestAppState();
            }
            this.chromeState = this.activeView.update(state, this.chromeState, appActions);
            Object.keys(this.activeChrome).forEach(function (name) {
                var chrome = _this2.activeChrome[name];
                chrome.update(state, _this2.chromeState, appActions);
            });
        }
    }, {
        key: 'loadRoute',
        value: function loadRoute(route, props, chromeProps, appActions) {
            var _this3 = this;

            if (!route.path) {
                throw new Error("Route views can only be loaded with paths.");
            }
            if (this.activeView) {
                this.exitingView = this.activeView;
            }
            var container = document.createElement("div");
            container.className = this.contextKey + '-' + route.viewName;
            this.viewContainer.appendChild(container);
            var view = this.viewSet[route.viewName].spawnView(container, route);
            this.visibleViews[route.path] = view;
            this.activeView = view;
            var viewReadyPromise = view.preLoadData(props, appActions).then(function (state) {
                console.log("Creating View", view);
                view.create(_this3.getLatestAppState(), chromeProps, appActions);
                view.postLoadData(_this3.getLatestAppState(), appActions);
            });
            console.log("Loading route", route);
            this.transitionViews(this.activeView, viewReadyPromise, this.exitingView);
        }
    }, {
        key: 'setTransitionHandler',
        value: function setTransitionHandler(func) {
            this.transitionHandler = func;
        }
    }, {
        key: 'transitionViews',
        value: function transitionViews(entering, loadingPromise, exiting) {
            var _this4 = this;

            if (this.transitionHandler) {
                this.transitionHandler(entering, loadingPromise, exiting);
            } else {
                (function () {
                    // default transition handling
                    var enterContainer = entering.container;
                    var enterClass = _this4.contextKey + '-enteringView';
                    var exitClass = _this4.contextKey + '-exitingView';
                    enterContainer.classList.add(enterClass);
                    if (exiting) {
                        var exitContainer = exiting.container;
                        exitContainer.style.opacity = "0.5";
                        exitContainer.classList.add(exitClass);
                        loadingPromise.then(function (result) {
                            exiting.destroy();
                            enterContainer.classList.remove(enterClass);
                        });
                    }
                })();
            }
        }
    }]);
    return UIContext;
}();

var OffsideAppContainer = function () {
    function OffsideAppContainer() {
        classCallCheck(this, OffsideAppContainer);

        this.uiContexts = {};
        this.commsChannels = {};
        this.appActor = new AppActor();
        this.appActor.setStateGetter = this.getState.bind(this);
        this.appActions = {
            ui: {},
            business: {},
            comms: {}
        };
    }

    createClass(OffsideAppContainer, [{
        key: 'setBusinessDispatch',
        value: function setBusinessDispatch(func) {
            this.appActor.setBusinessDispatch(func);
        }
    }, {
        key: 'setBusinessActions',
        value: function setBusinessActions(actionObject) {
            var _this = this;

            var binder = function binder(leaf) {
                if ((typeof leaf === 'undefined' ? 'undefined' : _typeof(leaf)) === "object") {
                    var _ret = function () {
                        var funcs = {};
                        Object.keys(leaf).forEach(function (funcKey) {
                            funcs[funcKey] = binder(leaf[funcKey]);
                        });
                        return {
                            v: funcs
                        };
                    }();

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                } else if (typeof leaf === "function") {
                    return leaf.bind(_this.appActor);
                } else {
                    return leaf;
                }
            };
            this.appActions.business = binder(actionObject);
        }
    }, {
        key: 'addCommsChannel',
        value: function addCommsChannel(commsChannel) {
            this.commsChannels[commsChannel.name] = commsChannel;
            this.appActions.comms[commsChannel.name] = commsChannel.actions();
            commsChannel.setStateSetter(this.updateCommsState.bind(this));
        }
    }, {
        key: 'setUiDispatch',
        value: function setUiDispatch(func) {
            this.appActor.setUiDispatch(func);
        }
    }, {
        key: 'setUiActions',
        value: function setUiActions(actionObject) {
            var _this2 = this;

            var binder = function binder(leaf) {
                if ((typeof leaf === 'undefined' ? 'undefined' : _typeof(leaf)) === "object") {
                    var _ret2 = function () {
                        var funcs = {};
                        Object.keys(leaf).forEach(function (funcKey) {
                            funcs[funcKey] = binder(leaf[funcKey]);
                        });
                        return {
                            v: funcs
                        };
                    }();

                    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
                } else if (typeof leaf === "function") {
                    return leaf.bind(_this2.appActor);
                } else {
                    return leaf;
                }
            };
            this.appActions.ui = binder(actionObject);
        }
    }, {
        key: 'setupLocalisation',
        value: function setupLocalisation(translationResources) {
            this.localizeSpawner = new LocalizeSpawner(translationResources);
        }
    }, {
        key: 'addUIContext',
        value: function addUIContext(name, context) {
            this.uiContexts[name] = context;
        }
    }, {
        key: 'loadUIContext',
        value: function loadUIContext(contextName) {
            this.activeUI = this.uiContexts[contextName];
            this.activeUI.setContextKey(contextName);
        }
    }, {
        key: 'initializeAppState',
        value: function initializeAppState(lang, businessData, uiData, chromeData) {
            var _this3 = this;

            if (!this.activeUI) {
                throw new Error("UI Context must be loaded before initializing app.");
            }
            var l10n = this.localizeSpawner.loadLocale(lang);
            var route = this.activeUI.getMatchFromRoute(window.location.pathname);
            var comms = {};
            Object.keys(this.commsChannels).forEach(function (name) {
                comms[name] = _this3.commsChannels[name].getState();
            });
            var routes = this.activeUI.routeTable;
            this.appState = { l10n: l10n, uiData: uiData, businessData: businessData, route: route, routes: routes, comms: comms };
            this.chromeState = chromeData;
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.appState;
        }
    }, {
        key: 'initializeUI',
        value: function initializeUI(container) {
            this.activeUI.setStateGetter(this.getState.bind(this));
            this.setupRouteListeners();
            this.activeUI.initialize(container, this.appState, this.chromeState, this.appActions);
        }
    }, {
        key: 'updateCommsState',
        value: function updateCommsState(key, state) {
            var _this4 = this;

            var nextComms = {};
            Object.keys(this.appState.comms).forEach(function (name) {
                nextComms[name] = _this4.appState.comms[name];
            });
            nextComms[key] = state;
            this.updateAppState("comms", nextComms);
        }
    }, {
        key: 'updateAppState',
        value: function updateAppState(key, updateValue) {
            var nextState = {
                l10n: this.appState.l10n,
                route: this.appState.route,
                routes: this.appState.routes,
                comms: this.appState.comms,
                uiData: this.appState.uiData,
                businessData: this.appState.businessData
            };
            // short circuit if no actual changes given
            if (nextState[key] === updateValue) {
                return;
            }
            if (key === "route") {
                nextState.route = updateValue;
            }
            if (key === "comms") {
                nextState.comms = updateValue;
            }
            if (key === "uiData") {
                nextState.uiData = updateValue;
            }
            if (key === "businessData") {
                nextState.businessData = updateValue;
            }
            this.appState = nextState;
            console.log("App Update", nextState);
            this.activeUI.update(nextState, this.appActions);
        }
    }, {
        key: 'setupRouteListeners',
        value: function setupRouteListeners() {
            var _this5 = this;

            document.addEventListener("click", function (e) {
                var target = e.target;
                while (target && target.tagName !== 'A') {
                    target = target.parentNode;
                }
                if (target && target.getAttribute("href")) {
                    var path = target.getAttribute("href");
                    if (path.indexOf("http") === 0) {
                        return;
                    }
                    e.preventDefault();
                    var route = _this5.activeUI.getMatchFromRoute(path);
                    window.history.pushState(null, "", path);
                    _this5.updateAppState("route", route);
                }
            });
            window.onpopstate = function (event) {
                var path = window.location.pathname;
                var route = _this5.activeUI.getMatchFromRoute(path);
                _this5.updateAppState("route", route);
            };
            window.onpageshow = function (event) {
                var path = window.location.pathname;
                var route = _this5.activeUI.getMatchFromRoute(path);
                _this5.updateAppState("route", route);
            };
        }
    }]);
    return OffsideAppContainer;
}();

exports['default'] = OffsideAppContainer;
exports.UIContext = UIContext;
exports.CommsChannel = CommsChannel;
exports.Localize = LocalizeSpawner;
exports.AppActor = AppActor;