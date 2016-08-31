'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var i18next = require('i18next');
var moment = require('moment');
var Route = _interopDefault(require('route-parser'));

class LocalizeSpawner {
    constructor(translationResources) {
        this.translationResources = translationResources;
    }
    loadLocale(langCode) {
        const i18n = i18next.init({
            lng: langCode,
            resources: this.translationResources,
        });
        const localMoment = moment().locale(langCode);
        return new LocalizeContext(langCode, i18n);
    }
}
class LocalizeContext {
    constructor(langCode, i18n) {
        this.langCode = langCode;
        this.i18n = i18n;
    }
    translate(key, params) {
        return this.i18n.t(key, params);
    }
    formatMoment(datetime, format) {
        return moment(datetime).locale(this.langCode).format(format);
    }
    customDatetime(datetime, format) { return this.formatMoment(datetime, format); }
    time(datetime) { return this.formatMoment(datetime, "LT"); }
    fullDatetime(datetime) { return this.formatMoment(datetime, "LLL"); }
    abbrDatetime(datetime) { return this.formatMoment(datetime, "lll"); }
    fullDate(datetime) { return this.formatMoment(datetime, "LL"); }
    abbrDate(datetime) { return this.formatMoment(datetime, "ll"); }
    numericDate(datetime) { return this.formatMoment(datetime, "L"); }
}

class View {
    constructor(options) {
        this.options = options;
    }
}

class Chrome {
    constructor(options) {
        this.options = options;
    }
}

/* RouteTable
 *
 * A class for managing a set of path routes in the UI Context. View names
 * must correlate to Views in this UI Context's ViewSet.
 */
class RouteTable {
    constructor(routeBase = "") {
        this.routeBase = routeBase;
        this.routes = [];
    }
    // add a route to the set, they are parsed in sequence so higher
    // priority routes should be added first
    addRoute(routePath, viewName, routeName) {
        const route = new RouteMatcher(routePath, viewName, routeName);
        this.routes.push(route);
    }
    // take a path and match it to a route, otherwise returning null
    matchPath(fullPath) {
        const scopedPath = fullPath.replace(this.routeBase, "");
        const match = this.routes.find((route) => {
            return route.match(scopedPath);
        });
        return match ? match : null;
    }
    // get a path from a provided routeName and parameters
    getPath(routeName, params) {
        if (!params) {
            params = {};
        }
        const route = this.routes.find((route) => route.routeName == routeName);
        if (route) {
            return `${this.routeBase}${route.reverse(params)}`;
        }
        else {
            return "/route-not-found";
        }
    }
}
class RouteMatcher {
    constructor(route, viewName, routeName) {
        this.routeMatcher = new Route(route);
        this.viewName = viewName;
        this.routeName = routeName ? routeName : viewName;
    }
    match(path) {
        return this.routeMatcher.match(path);
    }
    reverse(params) {
        return this.routeMatcher.reverse(params);
    }
}

class UIContext {
    constructor(urlBase) {
        this.viewSet = {};
        this.chromeSet = {};
        this.routeTable = new RouteTable();
    }
    addView(key, viewOptions) {
        this.viewSet[key] = new View(viewOptions);
    }
    addChrome(key, chromeOptions) {
        this.chromeSet[key] = new Chrome(chromeOptions);
    }
    addRoute(routePath, viewName, routeName) {
        this.routeTable.addRoute(routePath, viewName, routeName);
    }
    setRenderOrder(newOrder) {
        this.renderOrder = newOrder;
    }
}

class OffsideAppContainer {
    constructor() {
        this.uiContexts = [];
    }
    setupLocalisation(translationResources) {
        this.localizeSpawner = new LocalizeSpawner(translationResources);
    }
    setupUIContext(context) {
        this.uiContexts.push(context);
    }
}

exports['default'] = OffsideAppContainer;
exports.UIContext = UIContext;
exports.Localize = LocalizeSpawner;