enum Views {
  Default = 'Default',
  AddPolicy = 'AddPolicy',
  Details = 'Details',
}

const ROUTES: Record<Views, string> = {
  [Views.Default]: '/device/policies',
  [Views.AddPolicy]: '/device/policies/add',
  [Views.Details]: '/device/policies/:policy_id',
}

export { ROUTES, Views }
