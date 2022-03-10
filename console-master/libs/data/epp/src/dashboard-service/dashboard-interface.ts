import type { ThreatEvents, ThreatsByPriority, ThreatStats, TopTenLists, TotalFilesAnalyzed } from './dashboard-types'

interface EppDashboardInterface {
  /**
   * Gets counts for Threat Stats widgets (Running Threats,
   * Auto-Run Threats, Quarantined Threats, Unique to Cylance)
   */
  getThreatStats(): Promise<ThreatStats>

  /**
   * Gets count for Total Files Analyzed
   */
  getTotalFilesAnalyzed(): Promise<TotalFilesAnalyzed>

  /**
   * Gets threat counts for Threats By Priority
   */
  getThreatsByPriority(): Promise<ThreatsByPriority>

  /**
   * Get percentage value for Threat Protection widget
   */
  getThreatProtectionPercentage(): Promise<number>

  /**
   * Get percentage value for Device Protection widget
   */
  getDeviceProtectionPercentage(): Promise<number>

  /**
   * Get data for Top Ten Lists
   */
  getTopTenLists(): Promise<TopTenLists>

  /**
   * Gets threat events
   */
  getThreatEvents(): Promise<ThreatEvents[]>
}

export { EppDashboardInterface }
