import { light as blueLight } from '../dsm/blue'
import { light as greenLight } from '../dsm/green'
import { THEME_NAME } from '../name'

const alert = THEME_NAME === 'BB_BLUE' ? blueLight : greenLight
const charts = {
  default: {
    chart1: '#1475dc',
    chart2: '#9bc2ec',
    chart3: '#2d6199',
    chart4: '#01beff',
    chart5: '#008cba',
    chart6: '#0c2452',
    chart7: '#4390e3',
    chart8: '#7ac0d7',
    chart9: '#0190c2',
    chart10: '#01359c',
    chart11: '#6382c0',
  },
  alert: {
    chart1: alert.chipAlert.critical,
    chart2: alert.chipAlert.high,
    chart3: alert.chipAlert.medium,
    chart4: alert.chipAlert.low,
    chart5: alert.chipAlert.info,
  },
}

export default charts
