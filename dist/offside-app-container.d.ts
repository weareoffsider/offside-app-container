declare module "AppContainer/Localize" {
    export default class LocalizeSpawner {
        private translationResources;
        constructor(translationResources: any);
        loadLocale(langCode: string): LocalizeContext;
    }
    export class LocalizeContext {
        private langCode;
        private i18n;
        constructor(langCode: string, i18n: I18next.I18n);
        translate(key: string, params?: any): any;
        private formatMoment(datetime, format);
        customDatetime(datetime: any, format: string): string;
        time(datetime: any): string;
        fullDatetime(datetime: any): string;
        abbrDatetime(datetime: any): string;
        fullDate(datetime: any): string;
        abbrDate(datetime: any): string;
        numericDate(datetime: any): string;
    }
}
declare module "UIEngine/RouteTable" {
    export default class RouteTable {
        routeBase: string;
        routes: Array<RouteMatcher>;
        constructor(routeBase?: string);
        addRoute(routePath: string, viewName: string, routeName?: string): void;
        matchPath(fullPath: string): RouteMatcher;
        getPath(routeName: string, params?: any): string;
    }
    export class RouteMatcher {
        routeMatcher: any;
        viewName: string;
        routeName: string;
        path: string;
        constructor(route?: string, viewName?: string, routeName?: string);
        attachPath(path: string): RouteMatcher;
        match(path: string): boolean;
        reverse(params?: any): string;
    }
}
declare module "AppContainer/DataModel" {
    import { LocalizeContext } from "AppContainer/Localize";
    import RouteTable, { RouteMatcher } from "UIEngine/RouteTable";
    export interface AppState<BusinessData, UIData> {
        l10n: LocalizeContext;
        route?: RouteMatcher;
        routes: RouteTable;
        uiData: UIData;
        businessData: BusinessData;
    }
    export interface AppActions<BusinessData, UIData> {
        business?: any;
        ui?: any;
        forms?: any;
        routes?: any;
        comms?: any;
    }
    export class AppActor<BusinessData, UIData, BusinessAction, UIAction> {
        getAppState: () => AppState<BusinessData, UIData>;
        businessDispatch: (a: BusinessAction) => void;
        uiDispatch: (a: UIAction) => void;
        setStateGetter(func: () => AppState<BusinessData, UIData>): void;
        setBusinessDispatch(func: (a: BusinessAction) => void): void;
        setUiDispatch(func: (a: UIAction) => void): void;
    }
    export interface BusinessDataInterface<BusinessData, BusinessAction> {
        dispatch: (action: BusinessAction) => void;
    }
}
declare module "UIEngine/View" {
    import { AppState, AppActions } from "AppContainer/DataModel";
    import { RouteMatcher } from "UIEngine/RouteTable";
    export interface ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData> {
        preLoad?(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>;
        postLoad?(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>;
        createView(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): ViewRenderData;
        updateChrome?(state: AppState<BusinessData, UIData>, chromeData: UIChromeData, data?: ViewRenderData): UIChromeData;
        updateView(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>, data: ViewRenderData): ViewRenderData;
        destroyView(container: Element, data?: ViewRenderData): void;
    }
    export default class ViewDefinition<BusinessData, UIData, UIChromeData, ViewRenderData> {
        private options;
        constructor(options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>);
        spawnView(container: Element, route: RouteMatcher): View<BusinessData, UIData, UIChromeData, ViewRenderData>;
    }
    export class View<BusinessData, UIData, UIChromeData, ViewRenderData> {
        container: Element;
        route: RouteMatcher;
        private options;
        private viewData;
        private loaded;
        constructor(container: Element, route: RouteMatcher, options: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>);
        preLoadData(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>;
        postLoadData(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): Promise<any>;
        create(state: AppState<BusinessData, UIData>, chromeData: UIChromeData, actions: AppActions<BusinessData, UIData>): UIChromeData;
        update(state: AppState<BusinessData, UIData>, chromeData: UIChromeData, actions: AppActions<BusinessData, UIData>): UIChromeData;
        destroy(): void;
    }
}
declare module "UIEngine/Chrome" {
    import { AppState, AppActions } from "AppContainer/DataModel";
    export interface ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData> {
        initializeChrome(container: Element, state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): ChromeRenderData;
        updateChrome(container: Element, state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>, data?: ChromeRenderData): ChromeRenderData;
    }
    export default class ChromeDefinition<BusinessData, UIData, UIChromeData, ChromeRenderData> {
        private options;
        constructor(options: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>);
        getOptions(): ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>;
    }
    export class Chrome<BusinessData, UIData, UIChromeData, ChromeRenderData> {
        private container;
        private options;
        private chromeData;
        constructor(container: Element, options: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>);
        initialize(state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): void;
        update(state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): void;
    }
}
declare module "UIEngine/UIContext" {
    import { ViewOptions, View } from "UIEngine/View";
    import { ChromeOptions } from "UIEngine/Chrome";
    import RouteTable, { RouteMatcher } from "UIEngine/RouteTable";
    import { AppState, AppActions } from "AppContainer/DataModel";
    export default class UIContext<BusinessData, UIData, UIChromeData, ViewRenderData, ChromeRenderData> {
        private contextKey;
        private viewSet;
        private chromeSet;
        private activeChrome;
        routeTable: RouteTable;
        private viewContainer;
        private visibleViews;
        private activeView;
        private exitingView;
        private renderOrder;
        private transitionHandler;
        private getLatestAppState;
        private getLatestAppActions;
        private chromeState;
        constructor(urlBase: string);
        addView(key: string, viewOptions: ViewOptions<BusinessData, UIData, UIChromeData, ViewRenderData>): void;
        addChrome(key: string, chromeOptions: ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData>): void;
        addRoute(routePath: string, viewName: string, routeName?: string): void;
        getMatchFromRoute(path: string): RouteMatcher;
        setRenderOrder(newOrder: Array<string>): void;
        setContextKey(contextKey: string): void;
        setStateGetter(getter: () => AppState<BusinessData, UIData>): void;
        initialize(container: Element, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>): void;
        update(state: AppState<BusinessData, UIData>, appActions: AppActions<BusinessData, UIData>): void;
        loadRoute(route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>): void;
        setTransitionHandler(func: (entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>) => void): void;
        transitionViews(entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>): void;
    }
}
declare module "offside-app-container" {
    import Localize from "AppContainer/Localize";
    import { AppState, AppActions, AppActor } from "AppContainer/DataModel";
    import UIContext from "UIEngine/UIContext";
    export default class OffsideAppContainer<BusinessData, UIData, UIChromeData, BusinessAction, UIAction> {
        localizeSpawner: Localize;
        activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any>;
        uiContexts: {
            [key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any>;
        };
        appState: AppState<BusinessData, UIData>;
        chromeState: UIChromeData;
        appActions: AppActions<BusinessData, UIData>;
        appActor: AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        constructor();
        setBusinessDispatch(func: (a: BusinessAction) => void): void;
        setBusinessActions(actionObject: any): void;
        setUiDispatch(func: (a: UIAction) => void): void;
        setUiActions(actionObject: any): void;
        setupLocalisation(translationResources: any): void;
        addUIContext<ViewData, ChromeData>(name: string, context: UIContext<BusinessData, UIData, UIChromeData, ViewData, ChromeData>): void;
        loadUIContext(contextName: string): void;
        initializeAppState(lang: string, businessData: BusinessData, uiData: UIData, chromeData: UIChromeData): void;
        getState(): AppState<BusinessData, UIData>;
        initializeUI(container: Element): void;
        updateAppState(key: string, updateValue: any): void;
        setupRouteListeners(): void;
    }
    export { UIContext, Localize, AppState, AppActions, AppActor };
}
