export default (
  storedSettings,
  { definedGeozones, learnedGeozones, behavioral, appAnomalyDetection, networkAnomalyDetection, ipAddress },
  ipAddressRisk,
  NetworkAnomalyDetection,
) => ({
  settings: {
    ...storedSettings,
    definedGeozones,
    learnedGeozones: {
      enabled: learnedGeozones.enabled,
      geozoneDistance: {
        innerRadius: {
          value: parseInt(learnedGeozones.geozoneDistance.innerRadius.value, 10),
          unit: learnedGeozones.geozoneDistance.innerRadius.unit,
        },
        outerRadius: {
          value: parseInt(learnedGeozones.geozoneDistance.outerRadius.value, 10),
          unit: learnedGeozones.geozoneDistance.outerRadius.unit,
        },
      },
    },
    behavioral,
    appAnomalyDetection,
    ...(NetworkAnomalyDetection && {
      networkAnomalyDetection,
    }),
    ...(ipAddressRisk && {
      ipAddress: {
        ...storedSettings.ipAddress,
        enabled: ipAddress.enabled,
        scoreIfNotInLists: parseInt(ipAddress.scoreIfNotInLists),
        scoreIfNoIPAddress: parseInt(ipAddress.scoreIfNoIPAddress),
      },
    }),
  },
})
