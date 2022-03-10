import { all, takeLatest } from 'redux-saga/effects'

import {
  CREATE_PARTNER,
  EDIT_PARTNER,
  EDIT_PARTNER_BILLING,
  GET_PARTNER_BILLING_HISTORY,
  GET_PARTNER_BILLING_INFO,
  GET_PARTNER_DETAILS,
  GET_PARTNER_DETAILS_BY_ID,
  GET_PARTNER_LIST,
  GET_PARTNER_USER_LIST,
  SIGN_PARTNER_EULA,
} from '../actions'
import createPartnerSaga from './createPartner'
import editPartnerSaga from './editPartner'
import editPartnerBillingSaga from './editPartnerBilling'
import getPartnerBillingHistorySaga from './getPartnerBillingHistory'
import getPartnerBillingInfoSaga from './getPartnerBillingInfo'
import getPartnerDetailsSaga from './getPartnerDetails'
import getPartnerDetailsByIdSaga from './getPartnerDetailsById'
import getPartnerListSaga from './getPartnerList'
import getPartnerUserListSaga from './getPartnerUserList'
import signPartnerEula from './signPartnerEula'

export {
  getPartnerListSaga,
  createPartnerSaga,
  getPartnerUserListSaga,
  getPartnerDetailsSaga,
  getPartnerBillingInfoSaga,
  editPartnerSaga,
  editPartnerBillingSaga,
  getPartnerBillingHistorySaga,
  getPartnerDetailsByIdSaga,
  signPartnerEula,
}

export default function* watchers() {
  yield all([
    takeLatest(GET_PARTNER_LIST, getPartnerListSaga),
    takeLatest(CREATE_PARTNER, createPartnerSaga),
    takeLatest(GET_PARTNER_USER_LIST, getPartnerUserListSaga),
    takeLatest(GET_PARTNER_DETAILS, getPartnerDetailsSaga),
    takeLatest(GET_PARTNER_BILLING_INFO, getPartnerBillingInfoSaga),
    takeLatest(EDIT_PARTNER, editPartnerSaga),
    takeLatest(EDIT_PARTNER_BILLING, editPartnerBillingSaga),
    takeLatest(GET_PARTNER_BILLING_HISTORY, getPartnerBillingHistorySaga),
    takeLatest(GET_PARTNER_DETAILS_BY_ID, getPartnerDetailsByIdSaga),
    takeLatest(SIGN_PARTNER_EULA, signPartnerEula),
  ])
}
