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
declare module "UIEngine/View" {
    export interface ViewOptions<UIData, UIChromeData, ViewData> {
        preLoad?(props: UIData): Promise<any>;
        postLoad?(props: UIData): Promise<any>;
        createView(container: Element, props: UIData): ViewData;
        updateChrome?(props: UIData, chromeData: UIChromeData, data?: ViewData): UIChromeData;
        updateView(container: Element, props: UIData, data: ViewData): ViewData;
        destroyView(container: Element, props: UIData, data: ViewData): void;
    }
    export default class ViewDefinition<UIData, UIChromeData, ViewData> {
        private options;
        constructor(options: ViewOptions<UIData, UIChromeData, ViewData>);
    }
    export class View<UIData, UIChromeData, ViewData> {
        private container;
        private options;
        private viewData;
        constructor(container: Element, options: ViewOptions<UIData, UIChromeData, ViewData>);
        preLoadData(props: UIData): Promise<any>;
        postLoadData(props: UIData): Promise<any>;
        create(props: UIData, chromeData: UIChromeData): UIChromeData;
        update(props: UIData, chromeData: UIChromeData): UIChromeData;
        destroy(props: UIData): void;
    }
}
declare module "UIEngine/Chrome" {
    export interface ChromeOptions<UIData, UIChromeData, ChromeData> {
        initializeChrome(container: Element, props: UIData, chromeProps: UIChromeData): ChromeData;
        updateChrome(container: Element, props: UIData, chromeProps: UIChromeData, data?: ChromeData): ChromeData;
    }
    export default class ChromeDefinition<UIData, UIChromeData, ChromeData> {
        private options;
        constructor(options: ChromeOptions<UIData, UIChromeData, ChromeData>);
    }
    export class Chrome<UIData, UIChromeData, ChromeData> {
        private container;
        private options;
        private chromeData;
        constructor(container: Element, options: ChromeOptions<UIData, UIChromeData, ChromeData>);
        initialize(props: UIData, chromeProps: UIChromeData): void;
        update(props: UIData, chromeProps: UIChromeData): void;
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
        constructor(route: string, viewName: string, routeName?: string);
        match(path: string): boolean;
        reverse(params?: any): string;
    }
}
declare module "UIEngine/UIContext" {
    import { ViewOptions } from "UIEngine/View";
    import { ChromeOptions } from "UIEngine/Chrome";
    export default class UIContext<UIData, UIChromeData, ViewData, ChromeData> {
        private viewSet;
        private chromeSet;
        private routeTable;
        private renderOrder;
        constructor(urlBase: string);
        addView(key: string, viewOptions: ViewOptions<UIData, UIChromeData, ViewData>): void;
        addChrome(key: string, chromeOptions: ChromeOptions<UIData, UIChromeData, ChromeData>): void;
        addRoute(routePath: string, viewName: string, routeName?: string): void;
        setRenderOrder(newOrder: Array<string>): void;
        initialize(container: Element): void;
    }
}
declare module "offside-app-container" {
    import Localize from "AppContainer/Localize";
    import UIContext from "UIEngine/UIContext";
    export default class OffsideAppContainer<EngineData, UIData, UIChromeData> {
        localizeSpawner: Localize;
        activeUIContext: UIContext<UIData, UIChromeData, any, any>;
        uiContexts: {
            [key: string]: UIContext<UIData, UIChromeData, any, any>;
        };
        constructor();
        setupLocalisation(translationResources: any): void;
        addUIContext<ViewData, ChromeData>(name: string, context: UIContext<UIData, UIChromeData, ViewData, ChromeData>): void;
        loadUIContext(container: Element, contextName: string): void;
    }
    export { UIContext, Localize };
}
