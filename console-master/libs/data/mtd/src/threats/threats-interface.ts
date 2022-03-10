import type { Response } from '../types'
import type {
  EcsEntityResponse,
  EndpointCounts,
  MobileThreatDeviceDetail,
  MobileThreatEventCount,
  MobileThreatEventDetail,
  MobileThreatEventQueryData,
  MobileThreatEventQueryEntry,
  MobileThreatEventSeries,
} from './threats-types'

export default interface ThreatsInterface {
  /**
   * Gets counts
   */
  getMobileEventCounts(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>>

  /**
   * Gets count series
   */
  getMobileEventSeries(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventSeries[]>>

  /**
   * Gets top threats
   */
  getTopMobileThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatEventDetail[]>>

  /**
   * Gets resolved devices with threat stats
   */
  getMobileDevicesWithThreats(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>>

  /**
   * Gets top devices with threats
   */
  getTopMobileDevicesWithThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatDeviceDetail[]>>

  /**
   * Gets endpoint counts
   */
  getEndpointCounts(): Promise<Response<EndpointCounts>>

  /**
   * Gets ECS device counts
   */
  getEcsDeviceCount(): Promise<Response<EcsEntityResponse>>
}
