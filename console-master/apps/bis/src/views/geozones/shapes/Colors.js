import { RiskLevel } from '../../../shared'

const style = (risk, theme) => {
  let fillColor = theme.palette.bis.risk.high
  const fillOpacity = 0.4
  let strokeColor = theme.palette.bis.risk.high
  const strokeWeight = 2

  switch (risk) {
    case RiskLevel.MEDIUM:
      fillColor = theme.palette.bis.risk.medium
      strokeColor = theme.palette.bis.map.pin.medium
      break
    case RiskLevel.LOW:
      fillColor = theme.palette.bis.risk.low
      strokeColor = theme.palette.bis.risk.low
      break
  }

  return {
    fillColor,
    fillOpacity,
    strokeColor,
    strokeWeight,
  }
}

const hoverStyle = theme => ({
  fillOpacity: 0,
  strokeColor: theme.palette.bis.geozone.hover,
  strokeWeight: 8,
  strokePosition: 'outside',
})

export default {
  style,
  hoverStyle,
}
