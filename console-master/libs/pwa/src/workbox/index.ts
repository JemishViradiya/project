import type { workbox as Workbox } from './workbox'

importScripts('pwa/workbox/5.1.3/workbox-sw.js')

declare global {
  interface WorkerGlobalScope {
    workbox: Workbox
  }
}

// eslint-disable-next-line no-redeclare
const workbox = self.workbox as Workbox
declare type workbox = Workbox

export default workbox
