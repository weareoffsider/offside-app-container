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
        name: string;
        constructor(message: string);
    }
    export class RequestForbiddenError extends Error {
        readonly message: string;
        name: string;
        constructor(message: string);
    }
    export class RequestOfflineError extends Error {
        readonly message: string;
        name: string;
        constructor(message: string);
    }
    export class RequestServerError extends Error {
        readonly message: string;
        name: string;
        constructor(message: string);
    }
}
declare module "Comms/CommsChannel" {
    export interface CommsActions {
        get: (url: string) => Promise<any>;
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
    export function defaultErrorProcessing<CommData>(req: any, commData?: CommData): any;
    export default class CommsChannel<CommData> {
        name: string;
        urlRoot: string;
        commData: CommData;
        private prepareRequest;
        private processSuccess;
        private processError;
        private nextRequestKey;
        private state;
        private updateCommsState;
        constructor(name: string, urlRoot: string, commData: CommData, prepareRequest: (req: XMLHttpRequest, commData?: CommData) => void, processSuccess: (req: XMLHttpRequest, commData?: CommData) => any, processError?: (req: XMLHttpRequest, commData?: CommData) => any);
        setStateSetter(func: (name: string, state: CommsChannelState) => void): void;
        getState(): CommsChannelState;
        updateRequestState(key: number, request: CommsChannelRequest): void;
        get(url: string): Promise<any>;
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
        routeName: string;
        path: string;
        constructor(route?: string, viewName?: string, routeName?: string);
        attachPath(path: string): RouteMatcher;
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
        formType: string;
        formKey: string;
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
    import { FormState } from "Forms/FormData";
    export interface AppState<BusinessData, UIData> {
        l10n: LocalizeContext;
        route?: RouteMatcher;
        comms: {
            [key: string]: CommsChannelState;
        };
        forms: {
            [key: string]: FormState;
        };
        routes: RouteTable;
        uiData: UIData;
        businessData: BusinessData;
    }
    export interface AppActions<BusinessData, UIData> {
        business?: any;
        ui?: any;
        forms?: any;
        routes?: any;
        comms: {
            [key: string]: CommsActions;
        };
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
declare module "Forms/FormValidators" {
    import { FormState } from "Forms/FormData";
    import { AppState, AppActor } from "AppContainer/DataModel";
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
    export function fieldRequired<BusinessData, UIData, BusinessAction, UIAction>(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>): Promise<boolean>;
    export function emailValidate<BusinessData, UIData, BusinessAction, UIAction>(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>): Promise<boolean>;
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
        getInitState(formType: string, formKey: string): FormState;
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
        readonly validators: Array<(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>) => Promise<boolean>>;
        constructor(fieldType: string, required?: boolean, validationStyle?: FormValidationStyle, extraValidators?: Array<(value: any, formState: FormState, appState: AppState<BusinessData, UIData>, appActions: AppActor<BusinessData, UIData, BusinessAction, UIAction>) => Promise<boolean>>);
    }
}
declare module "Forms/FormManager" {
    import { FormState } from "Forms/FormData";
    import FormDefinition from "Forms/FormDefinition";
    import { AppState, AppActor } from "AppContainer/DataModel";
    export interface FormActions {
        init: (formType: string, formKey?: string) => void;
        updateField: (formKey: string, stepKey: string, fieldKey: string, value: any) => void;
        blurField: (formKey: string, stepKey: string, fieldKey: string) => void;
        validateField: (formKey: string, stepKey: string, fieldKey: string) => Promise<boolean>;
        submitStep: (formKey: string, stepKey: string) => Promise<boolean>;
    }
    export default class FormManager<BusinessData, UIData, BusinessAction, UIAction> {
        private formRegistry;
        getAppState: () => AppState<BusinessData, UIData>;
        getAppActor: () => AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        updateFormState: (newForm: any) => void;
        constructor();
        setStateGetter(func: () => AppState<BusinessData, UIData>): void;
        setActorGetter(func: () => AppActor<BusinessData, UIData, BusinessAction, UIAction>): void;
        setStateUpdater(func: (newForm: any) => void): void;
        addForm(form: FormDefinition<BusinessData, UIData, BusinessAction, UIAction>): void;
        readyNewState(): {
            [key: string]: FormState;
        };
        init(formType: string, formKey?: string): void;
        updateField(formKey: string, stepKey: string, fieldKey: string, value: any): void;
        blurField(formKey: string, stepKey: string, fieldKey: string): void;
        validateField(formKey: string, stepKey: string, fieldKey: string): Promise<boolean>;
        submitStep(formKey: string, stepKey: string): Promise<boolean>;
        actions(): FormActions;
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
        renderErrorView(viewName: string, container: Element, route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>, cb: any): void;
        loadRoute(route: RouteMatcher, props: AppState<BusinessData, UIData>, chromeProps: UIChromeData, appActions: AppActions<BusinessData, UIData>): void;
        setTransitionHandler(func: (entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>) => void): void;
        transitionViews(entering: View<BusinessData, UIData, UIChromeData, ViewRenderData>, loadingPromise: Promise<any>, exiting?: View<BusinessData, UIData, UIChromeData, ViewRenderData>): void;
    }
}
declare module "offside-app-container" {
    import Localize from "AppContainer/Localize";
    import CommsChannel, { CommsChannelState } from "Comms/CommsChannel";
    import FormDefinition, { FormStepDefinition, FormFieldDefinition, FormValidationStyle } from "Forms/FormDefinition";
    import { FormError, FormWarning } from "Forms/FormValidators";
    import FormManager from "Forms/FormManager";
    import { AppState, AppActions, AppActor } from "AppContainer/DataModel";
    import UIContext from "UIEngine/UIContext";
    export default class OffsideAppContainer<BusinessData, UIData, UIChromeData, BusinessAction, UIAction> {
        localizeSpawner: Localize;
        activeUI: UIContext<BusinessData, UIData, UIChromeData, any, any>;
        uiContexts: {
            [key: string]: UIContext<BusinessData, UIData, UIChromeData, any, any>;
        };
        commsChannels: {
            [key: string]: CommsChannel<any>;
        };
        appState: AppState<BusinessData, UIData>;
        chromeState: UIChromeData;
        formManager: FormManager<BusinessData, UIData, BusinessAction, UIAction>;
        appActions: AppActions<BusinessData, UIData>;
        appActor: AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        constructor();
        addForm(form: FormDefinition<BusinessData, UIData, BusinessAction, UIAction>): void;
        setBusinessDispatch(func: (a: BusinessAction) => void): void;
        bindActor(leaf: any): any;
        setBusinessActions(actionObject: any): void;
        addCommsChannel(commsChannel: CommsChannel<any>): void;
        setUiDispatch(func: (a: UIAction) => void): void;
        setUiActions(actionObject: any): void;
        setupLocalisation(translationResources: any): void;
        addUIContext<ViewData, ChromeData>(name: string, context: UIContext<BusinessData, UIData, UIChromeData, ViewData, ChromeData>): void;
        loadUIContext(contextName: string): void;
        initializeAppState(lang: string, businessData: BusinessData, uiData: UIData, chromeData: UIChromeData): void;
        getState(): AppState<BusinessData, UIData>;
        getActor(): AppActor<BusinessData, UIData, BusinessAction, UIAction>;
        initializeUI(container: Element): void;
        updateCommsState(key: string, state: CommsChannelState): void;
        updateAppState(key: string, updateValue: any): void;
        setupRouteListeners(): void;
    }
    export { UIContext, CommsChannel, Localize, AppState, AppActions, AppActor, FormDefinition, FormStepDefinition, FormFieldDefinition, FormValidationStyle, FormError, FormWarning };
}
