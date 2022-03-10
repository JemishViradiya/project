export const getEngineRiskLevel = (score, riskLevels) =>
  riskLevels?.find(({ range: { min, max } }) => score >= min && score <= max)?.level
