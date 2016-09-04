import Localize, {LocalizeContext} from './Localize';
import RouteTable, {RouteMatcher} from '../UIEngine/RouteTable'

export interface AppState<BusinessData, UIData> {
  l10n: LocalizeContext
  route?: RouteMatcher
  routes: RouteTable
  uiData: UIData
  businessData: BusinessData
}
