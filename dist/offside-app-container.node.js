'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var i18next = require('i18next');
var moment = require('moment');
var Route = _interopDefault(require('route-parser'));

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
                resources: this.translationResources
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

var ViewDefinition = function ViewDefinition(options) {
    classCallCheck(this, ViewDefinition);

    this.options = options;
};

var View = function () {
    function View(container, options) {
        classCallCheck(this, View);

        this.container = container;
        this.options = options;
    }

    createClass(View, [{
        key: "preLoadData",
        value: function preLoadData(props) {
            return this.options.preLoad ? this.options.preLoad(props) : Promise.resolve(true);
        }
    }, {
        key: "postLoadData",
        value: function postLoadData(props) {
            return this.options.postLoad ? this.options.postLoad(props) : Promise.resolve(true);
        }
    }, {
        key: "create",
        value: function create(props, chromeData) {
            this.viewData = this.options.createView(this.container, props);
            return this.options.updateChrome ? this.options.updateChrome(props, chromeData, this.viewData) : chromeData;
        }
    }, {
        key: "update",
        value: function update(props, chromeData) {
            this.viewData = this.options.updateView(this.container, props, this.viewData);
            return this.options.updateChrome ? this.options.updateChrome(props, chromeData, this.viewData) : chromeData;
        }
    }, {
        key: "destroy",
        value: function destroy(props) {
            this.options.destroyView(this.container, props, this.viewData);
        }
    }]);
    return View;
}();

var ChromeDefinition = function ChromeDefinition(options) {
    classCallCheck(this, ChromeDefinition);

    this.options = options;
};

var Chrome = function () {
    function Chrome(container, options) {
        classCallCheck(this, Chrome);

        this.container = container;
        this.options = options;
    }

    createClass(Chrome, [{
        key: "initialize",
        value: function initialize(props, chromeProps) {
            this.chromeData = this.options.initializeChrome(this.container, props, chromeProps);
        }
    }, {
        key: "update",
        value: function update(props, chromeProps) {
            this.chromeData = this.options.updateChrome(this.container, props, chromeProps);
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

        this.routeMatcher = new Route(route);
        this.viewName = viewName;
        this.routeName = routeName ? routeName : viewName;
    }

    createClass(RouteMatcher, [{
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
        key: 'setRenderOrder',
        value: function setRenderOrder(newOrder) {
            this.renderOrder = newOrder;
        }
    }, {
        key: 'initialize',
        value: function initialize(container) {
            console.log("UIContext INIT");
            container.textContent = "Render here.";
        }
    }]);
    return UIContext;
}();

var OffsideAppContainer = function () {
    function OffsideAppContainer() {
        classCallCheck(this, OffsideAppContainer);

        this.uiContexts = {};
    }

    createClass(OffsideAppContainer, [{
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
        value: function loadUIContext(container, contextName) {
            this.activeUIContext = this.uiContexts[contextName];
            this.activeUIContext.initialize(container);
        }
    }]);
    return OffsideAppContainer;
}();

exports['default'] = OffsideAppContainer;
exports.UIContext = UIContext;
exports.Localize = LocalizeSpawner;