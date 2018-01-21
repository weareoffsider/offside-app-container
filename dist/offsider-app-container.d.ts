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
declare module "Comms/Errors" {
    export class RequestNotFoundError extends Error {
        readonly message: string;
        request: XMLHttpRequest;
        name: string;
        constructor(message: string, request: XMLHttpRequest);
    }
    export class RequestClientError extends Error {
        readonly message: string;
        request: XMLHttpRequest;
        name: string;
        constructor(message: string, request: XMLHttpRequest);
    }
    export class RequestForbiddenError extends Error {
        readonly message: string;
        request: XMLHttpRequest;
        name: string;
        constructor(message: string, request: XMLHttpRequest);
    }
    export class RequestOfflineError extends Error {
        readonly message: string;
        request: XMLHttpRequest;
        name: string;
        constructor(message: string, request: XMLHttpRequest);
    }
    export class RequestServerError extends Error {
        readonly message: string;
        request: XMLHttpRequest;
        name: string;
        constructor(message: string, request: XMLHttpRequest);
    }
}
declare module "Comms/CommsChannel" {
    export interface CommsActions {
        get: (url: string) => Promise<any>;
        post: (url: string, data?: any) => Promise<any>;
        delete: (url: string, data?: any) => Promise<any>;
        upload: (url: string, data?: any) => Promise<any>;
        put: (url: string, data?: any) => Promise<any>;
    }
    export enum CommsChannelStatus {
        Offline = 0,
        Idle = 1,
        Active = 2,
    }
    export interface CommsChannelRequest {
        url: string;
        method: string;
        progress: number;
        status?: number;
        result?: any;
    }
    export interface CommsChannelState {
        requests: Array<CommsChannelRequest>;
        status: CommsChannelStatus;
        statusString: string;
    }
    export function defaultErrorProcessing(req: any, commData?: any): any;
    export default class CommsChannel {
        name: string;
        urlRoot: string;
        commData: any;
        prepareRequest: (req: XMLHttpRequest, commData?: any) => void;
        processSuccess: (req: XMLHttpRequest, commData?: any) => any;
        processError: (req: XMLHttpRequest, commData?: any) => any;
        private nextRequestKey;
        private state;
        private updateCommsState;
        constructor(name: string, urlRoot: string, commData: any, prepareRequest: (req: XMLHttpRequest, commData?: any) => void, processSuccess: (req: XMLHttpRequest, commData?: any) => any, processError?: (req: XMLHttpRequest, commData?: any) => any);
        setStateSetter(func: (name: string, state: CommsChannelState) => void): void;
        getState(): CommsChannelState;
        updateRequestState(key: number, request: CommsChannelRequest): void;
        post(url: string, data: any): Promise<any>;
        upload(url: string, data: any, method?: string): Promise<any>;
        put(url: string, data: any): Promise<any>;
        delete(url: string, data: any): Promise<any>;
        get(url: string, data: any): Promise<any>;
        actions(): CommsActions;
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
        params: any;
        routeName: string;
        path: string;
        constructor(route?: string, viewName?: string, routeName?: string);
        attachPath(path: string, urlBase?: string): RouteMatcher;
        match(path: string): boolean;
        reverse(params?: any): string;
    }
}
declare module "Forms/FormData" {
    export interface FormStepState {
        data: {
            [key: string]: any;
        };
        errors: {
            [key: string]: Array<string>;
        };
        warnings: {
            [key: string]: Array<string>;
        };
    }
    export interface FormState {
        currentStep: string;
        complete: boolean;
        steps: {
            [key: string]: FormStepState;
        };
    }
}
declare module "AppContainer/DataModel" {
    import { LocalizeContext } from "AppContainer/Localize";
    import { CommsActions, CommsChannelState } from "Comms/CommsChannel";
    import RouteTable, { RouteMatcher } from "UIEngine/RouteTable";
    export interface AppState<BusinessData, UIData> {
        l10n: LocalizeContext;
        route?: RouteMatcher;
        comms: {
            [key: string]: CommsChannelState;
        };
        routes: RouteTable;
        uiData: UIData;
        businessData: BusinessData;
    }
    export interface AppActions<BusinessData, UIData> {
        business?: any;
        ui?: any;
        routes?: any;
        screenStack?: any;
        comms: {
            [key: string]: CommsActions;
        };
    }
    export class AppActor<BusinessData, UIData, BusinessAction, UIAction> {
        getAppState: () => AppState<BusinessData, UIData>;
        getAppActions: () => AppActions<BusinessData, UIData>;
        businessDispatch: (a: BusinessAction) => void;
        uiDispatch: (a: UIAction) => void;
        setStateGetter(func: () => AppState<BusinessData, UIData>): void;
        setActionsGetter(func: () => AppActions<BusinessData, UIData>): void;
        setBusinessDispatch(func: (a: BusinessAction) => void): void;
        setUiDispatch(func: (a: UIAction) => void): void;
    }
    export interface BusinessDataInterface<BusinessData, BusinessAction> {
        dispatch: (action: BusinessAction) => void;
    }
}
declare module "Forms/FormValidators" {
    import { FormState } from "Forms/FormData";
    export class FormError extends Error {
        readonly message: string;
        name: string;
        constructor(message: string);
    }
    export class FormWarning extends Error {
        readonly message: string;
        name: string;
        constructor(message: string);
    }
    export function fieldRequired<StateData>(value: any, formState: FormState, stateData: StateData): Promise<boolean>;
    export function emailValidate<StateData>(value: any, formState: FormState, stateData: StateData): Promise<boolean>;
}
declare module "Forms/FormDefinition" {
    import { FormState, FormStepState } from "Forms/FormData";
    import { AppState, AppActor } from "AppContainer/DataModel";
    export enum FormValidationStyle {
        WhileEditing = 0,
        OnBlur = 1,
        OnStepEnd = 2,
    }
    export default class FormDefinition<BusinessData, UIData, BusinessAction, UIAction> {
        readonly name: string;
        readonly steps: {
            [key: string]: FormStepDefinition<BusinessData, UIData, BusinessAction, UIAction>;
        };
        readonly stepOrder: Array<string>;
        constructor(name: string);
        addStep(stepName: string, step: FormStepDefinition<BusinessData, UIData, BusinessAction, UIAction>): void;
        getInitState(): FormState;
    }
    export class FormStepDefinition<BusinessData, UIData, BusinessAction, UIAction> {
        readonly name: string;
        readonly fields: {
            [key: string]: FormFieldDefinition<BusinessData, UIData, BusinessAction, UIAction>;
        };
        readonly fieldOrder: Array<string>;
        constructor(name: string);
        addField(fieldName: string, field: FormFieldDefinition<BusinessData, UIData, BusinessAction, UIAction>): void;
        getInitState(): FormStepState;
    }
    export class FormFieldDefinition<BusinessData, UIData, BusinessAction, UIAction> {
        readonly fieldType: string;
        readonly required: boolean;
        readonly validationStyle: FormValidationStyle;
        readonly validators: Array<(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions?: AppActor<BusinessData, UIData, BusinessAction, UIAction>) => Promise<boolean>>;
        constructor(fieldType: string, required?: boolean, validationStyle?: FormValidationStyle, extraValidators?: Array<(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>) => Promise<boolean>>);
    }
}
declare module "Forms/FormInstance" {
    import FormDefinition from "Forms/FormDefinition";
    import { AppState } from "AppContainer/DataModel";
    export interface FormActions {
        init: (formType: string, formKey?: string) => void;
        updateField: (stepKey: string, fieldKey: string, value: any) => void;
        blurField: (stepKey: string, fieldKey: string) => void;
        validateField: (stepKey: string, fieldKey: string) => Promise<boolean>;
        submitStep: (stepKey: string) => Promise<boolean>;
    }
    export default class FormInstance<BusinessData, UIData, BusinessAction, UIAction> {
        formDefinition: FormDefinition<BusinessData, UIData, BusinessAction, UIAction>;
        validationData: AppState<BusinessData, UIData>;
        onUpdate: (formData: any) => void;
        formData: any;
        constructor(formDefinition: FormDefinition<BusinessData, UIData, BusinessAction, UIAction>, validationData: AppState<BusinessData, UIData>, onUpdate: (formData: any) => void);
        updateFormState(newData: any): void;
        updateValidationData(valData: AppState<BusinessData, UIData>): void;
        updateField(stepKey: string, fieldKey: string, value: any): void;
        blurField(stepKey: string, fieldKey: string): void;
        validateField(stepKey: string, fieldKey: string): Promise<boolean>;
        addFieldError(stepKey: string, fieldKey: string, errorText: string): any;
        submitStep(stepKey: string): Promise<boolean>;
    }
}
declare module "UIEngine/Chrome" {
    import { AppState, AppActions } from "AppContainer/DataModel";
    export interface ChromeOptions<BusinessData, UIData, UIChromeData, ChromeRenderData> {
        createChrome(container: Element, state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): ChromeRenderData;
        updateChrome(container: Element, state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>, data?: ChromeRenderData): ChromeRenderData;
        destroyChrome(container: Element, data?: ChromeRenderData): void;
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
        create(state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): void;
        update(state: AppState<BusinessData, UIData>, chromeProps: UIChromeData, actions: AppActions<BusinessData, UIData>): void;
        destroy(): void;
    }
}
declare module "UIEngine/Screen" {
    import { AppState, AppActions } from "AppContainer/DataModel";
    export interface ScreenProps {
        screenID: number;
        popScreen: () => void;
    }
    export interface ScreenOptions<BusinessData, UIData, ScreenRenderData> {
        renderScreenGuard?(popScreenFunc: any): Element | void;
        createScreen(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>, screenProps: ScreenProps): ScreenRenderData;
        updateScreen(container: Element, state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>, screenProps: ScreenProps, data?: ScreenRenderData): ScreenRenderData;
        destroyScreen(container: Element, data?: ScreenRenderData): void;
    }
    export default class ScreenDefinition<BusinessData, UIData, ScreenRenderData> {
        private options;
        constructor(options: ScreenOptions<BusinessData, UIData, ScreenRenderData>);
        getOptions(): ScreenOptions<BusinessData, UIData, ScreenRenderData>;
    }
    export class Screen<BusinessData, UIData, ScreenRenderData> {
        private id;
        private container;
        private options;
        private screenGuard;
        private screenData;
        private screenProps;
        constructor(id: number, container: Element, options: ScreenOptions<BusinessData, UIData, ScreenRenderData>, popScreenFunc: any, screenGuard?: Element | void);
        getId(): number;
        create(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): void;
        update(state: AppState<BusinessData, UIData>, actions: AppActions<BusinessData, UIData>): void;
        destroy(): void;
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
declare module "UIEngine/UIContext" {
    import { ViewOptions, View } from "UIEngine/View";
    import { ChromeOptions } from "UIEngine/Chrome";
    import { ScreenOptions } from "UIEngine/Screen";
    import RouteTable, { RouteMatcher } from "UIEngine/RouteTable";
    import { AppState, AppActions } from "AppContainer/DataModel";
    export default class UIContext<BusinessData, UIData, UIChromeData, ViewRenderData, ChromeRenderData, ScreenRenderData> {
        private contextKey;
        private viewSet;
        private chromeSet;
        private activeChrome;
        routeTable: RouteTable;
        urlBase: string;
        private viewContainer;
        private nextScreenID;
        private screenStack;
        private screenStackContainer;
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
        pushScreen(screenOptions: ScreenOptions<BusinessData, UIData, ScreenRenderData>): void;
        popScreen(id: number): void;
        screenActions(): any;
        addRoute(routePath: string, viewName: string, routeName?: string): void;
        getMatchFromRoute(path: string): RouteMatcher;
        setRenderOrder(newOrder: Array<string>): void;
        setContextKey(contextKey: string): void;
        setStateGetter(getter: () => AppState<BusinessData, UIData>): void;
        setActionsGetter(getter: () => AppActions<BusinessData, UIData>): void;
        initialize(container: Element, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>): void;
        update(state: AppState<BusinessData, UIData>, appActions: AppActions<BusinessData, UIData>): void;
        renderErrorView(viewName: string, container: Element, route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>, cb: any): void;
        loadRoute(route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>): void;
        setTransitionHandler(func: (entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>) => void): void;
        transitionViews(entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>): void;
    }
}
declare module "offsider-app-container" {
    import Localize from "AppContainer/Localize";
    import CommsChannel, { defaultErrorProcessing, CommsChannelState } from "Comms/CommsChannel";
    import { RequestServerError, RequestOfflineError, RequestForbiddenError, RequestNotFoundError, RequestClientError } from "Comms/Errors";
    import FormInstance from "Forms/FormInstance";
    import FormDefinition, { FormStepDefinition, FormFieldDefinition, FormValidationStyle } from "Forms/FormDefinition";
    import { FormError, FormWarning } from "Forms/FormValidators";
    import RouteTable, { RouteMatcher } from "UIEngine/RouteTable";
    import { AppState, AppActions, AppActor } from "AppContainer/DataModel";
    import UIContext from "UIEngine/UIContext";
    export default class OffsideAppContainer<BusinessData, UIData, UIChromeData, BusinessAction, UIAction> {
        localizeSpawner: Localize;
        activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any, any>;
        uiContexts: {
            [key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any, any>;
        };
        commsChannels: {
            [key: string]: CommsChannel;
        };
        appState: AppState<BusinessData, UIData>;
        chromeState: UIChromeData;
        appActions: AppActions<BusinessData, UIData>;
        appActor: AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        constructor();
        setBusinessDispatch(func: (a: BusinessAction) => void): void;
        bindActor(leaf: any): any;
        setBusinessActions(actionObject: any): void;
        addCommsChannel(commsChannel: CommsChannel): void;
        setUiDispatch(func: (a: UIAction) => void): void;
        setUiActions(actionObject: any): void;
        setupLocalisation(translationResources: any): void;
        addUIContext<ViewData, ChromeData, ScreenData>(name: string, context: UIContext<BusinessData, UIData, UIChromeData, ViewData, ChromeData, ScreenData>): void;
        loadUIContext(contextName: string): void;
        initializeAppState(lang: string, businessData: BusinessData, uiData: UIData, chromeData: UIChromeData): void;
        getState(): AppState<BusinessData, UIData>;
        getActions(): AppActions<BusinessData, UIData>;
        getActor(): AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        initializeUI(container: Element): void;
        updateCommsState(key: string, state: CommsChannelState): void;
        updateAppState(key: string, updateValue: any): void;
        setupRouteListeners(): void;
        goToRoute(path: string): void;
    }
    export { UIContext, CommsChannel, defaultErrorProcessing, RequestServerError, RequestOfflineError, RequestForbiddenError, RequestNotFoundError, RequestClientError, Localize, AppState, AppActions, AppActor, FormInstance, FormDefinition, FormStepDefinition, FormFieldDefinition, FormValidationStyle, FormError, FormWarning, RouteTable, RouteMatcher };
}
