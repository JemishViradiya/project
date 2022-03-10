import {
  CLEAR_PARTNER_BILLING_HISTORY,
  CLEAR_PARTNER_BILLING_INFO,
  CLEAR_PARTNER_DETAILS,
  SET_PARTNER_BILLING_HISTORY,
  SET_PARTNER_BILLING_INFO,
  SET_PARTNER_DETAILS,
  SET_PARTNER_LIST,
  SET_PARTNER_USER_LIST,
} from './actions'

const initialState = {
  partnerList: null,
  partnerUserList: null,
  partnerDetails: {
    name: null,
    website: null,
    email: null,
    phone: null,
    partnerType: null,
  },
  partnerBillingInfo: {
    isEnabled: false,
    billingProvider: null,
    billingModel: null,
    billingAccountId: null,
    subscriptionId: null,
  },
  partnerBillingHistory: null,
}

function setPartnerList(state, action) {
  return {
    ...state,
    partnerList: action.payload,
  }
}

function setPartnerUserList(state, action) {
  return {
    ...state,
    partnerUserList: action.payload,
  }
}

function setPartnerDetails(state, action) {
  return {
    ...state,
    partnerDetails: action.payload,
  }
}

function clearPartnerDetails(state) {
  return {
    ...state,
    partnerDetails: initialState.partnerDetails,
  }
}

function setPartnerBillingInfo(state, action) {
  return {
    ...state,
    partnerBillingInfo: action.payload,
  }
}

function clearPartnerBillingInfo(state) {
  return {
    ...state,
    partnerBillingInfo: initialState.partnerBillingInfo,
  }
}

function setPartnerBillingHistory(state, action) {
  return {
    ...state,
    partnerBillingHistory: action.payload,
  }
}

function clearPartnerBillingHistory(state) {
  return {
    ...state,
    partnerBillingHistory: initialState.partnerBillingHistory,
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PARTNER_LIST:
      return setPartnerList(state, action)
    case SET_PARTNER_USER_LIST:
      return setPartnerUserList(state, action)
    case SET_PARTNER_DETAILS:
      return setPartnerDetails(state, action)
    case CLEAR_PARTNER_DETAILS:
      return clearPartnerDetails(state)
    case SET_PARTNER_BILLING_INFO:
      return setPartnerBillingInfo(state, action)
    case CLEAR_PARTNER_BILLING_INFO:
      return clearPartnerBillingInfo(state)
    case SET_PARTNER_BILLING_HISTORY:
      return setPartnerBillingHistory(state, action)
    case CLEAR_PARTNER_BILLING_HISTORY:
      return clearPartnerBillingHistory(state)
    default:
      return state
  }
}
