export class Totals {
  pages: number
  elements: number
  constructor(pages: number, elements: number) {
    this.pages = pages
    this.elements = elements
  }
}

export class Navigation {
  next: string
  previous: string
  constructor(next: string, previous: string) {
    this.next = next
    this.previous = previous
  }
}

export class BrowserDomains {
  totals: Totals
  navigation: Navigation
  count: number
  elements: BrowserDomain[]

  constructor(totals: Totals, navigation: Navigation, count: number, elements: BrowserDomain[]) {
    this.totals = totals
    this.navigation = navigation
    this.count = count
    this.elements = elements
  }
}

export class BrowserDomain {
  guid: string
  domain: string
  description: string
  enabled: string
  policiesAssigned: number
  rootCA: string
  created: string
  updated: string
  constructor(
    guid: string,
    domain: string,
    description: string,
    enabled: string,
    policiesAssigned: number,
    rootCA: string,
    created: string,
    updated: string,
  ) {
    this.guid = guid
    this.domain = domain
    this.description = description
    this.enabled = enabled
    this.policiesAssigned = policiesAssigned
    this.rootCA = rootCA
    this.created = created
    this.updated = updated
  }
}
//   certThumbprint
