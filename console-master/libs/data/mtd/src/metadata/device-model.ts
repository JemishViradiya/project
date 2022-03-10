//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { MetadataQueryVariables } from './device-os-version'

export const queryDeviceModelsGpl = gql`
  query Metadata($osFamily: String!) {
    deviceModels(osFamily: $osFamily)
      @rest(type: "MtdDeviceModels", path: "/mtd/v1/device-metadata/hardwaremodels?osFamily={args.osFamily}", method: "GET") {
      name: string
      brand: brand
    }
  }
`

export const queryAndroidDeviceModelsMock = {
  deviceModels: [
    { name: 'HTC_M10h', model: 'htc_pmeuhl', brand: { name: '10', vendor: { name: 'htc' } } },
    { name: 'HTC 10 evo', model: 'htc_acauhl', brand: { name: '10 evo', vendor: { name: 'htc' } } },
    { name: 'Sharp Aquos', model: 'SG306SH', brand: { name: '306SH', vendor: { name: 'Sharp' } } },
    { name: '1505-A01', model: '1505-A01', brand: { name: '360 N4S', vendor: { name: 'QiKU' } } },
    { name: '1505-A02', model: '1505-A02', brand: { name: '360 N4S', vendor: { name: 'QiKU' } } },
    { name: 'Nokia 5.1', model: 'CO2_sprout', brand: { name: '5.1', vendor: { name: 'NOKIA' } } },
    { name: 'GIONEE A1', model: 'GIONEE_SWW1609', brand: { name: 'A1', vendor: { name: 'Gionee' } } },
    { name: 'ZTE A2019 Pro', model: 'P845A02', brand: { name: 'A2019 Pro', vendor: { name: 'ZTE' } } },
    { name: 'ZTE A2019G Pro', model: 'P845A01', brand: { name: 'A2019G Pro', vendor: { name: 'ZTE' } } },
    { name: '5046D', model: 'mickey6', brand: { name: 'A3', vendor: { name: 'TCT (Alcatel)' } } },
    { name: 'A33f', model: 'A33', brand: { name: 'A33f', vendor: { name: 'Oppo' } } },
    { name: 'Lenovo A368t', model: 'A368t', brand: { name: 'A368t', vendor: { name: 'Lenovo' } } },
    { name: 'Lenovo A369i', model: 'A369i', brand: { name: 'A369i', vendor: { name: 'Lenovo' } } },
    { name: 'A37f', model: 'A37f', brand: { name: 'A37f', vendor: { name: 'Oppo' } } },
    { name: 'L18011', model: 'L18011', brand: { name: 'A5', vendor: { name: 'Lenovo' } } },
    { name: 'CPH2061', model: 'OP4C77L1', brand: { name: 'A52', vendor: { name: 'Oppo' } } },
    { name: 'CPH2069', model: 'OP4C7BL1', brand: { name: 'A52', vendor: { name: 'Oppo' } } },
    { name: 'Lenovo A536', model: 'A536', brand: { name: 'A536', vendor: { name: 'Lenovo' } } },
    { name: 'Lenovo A5500-HV', model: 'A5500-HV', brand: { name: 'A5500-HV', vendor: { name: 'Lenovo' } } },
    { name: 'CPH1701', model: 'CPH1701', brand: { name: 'A57', vendor: { name: 'Oppo' } } },
    { name: 'Lenovo A6000', model: 'Kraft-A6000', brand: { name: 'A6000', vendor: { name: 'Lenovo' } } },
    { name: 'CPH2067', model: 'OP4C72L1', brand: { name: 'A72', vendor: { name: 'Oppo' } } },
    { name: 'Lenovo A889', model: 'A889', brand: { name: 'A889', vendor: { name: 'Lenovo' } } },
    { name: 'BLU ADVANCE 4.0 L2', model: 'BLU_ADVANCE_4_0_L2', brand: { name: 'ADVANCE 4.0 L2', vendor: { name: 'Blu' } } },
    { name: 'Advance 5.0 HD', model: 'Advance_5_0_HD', brand: { name: 'ADVANCE 5.0 HD', vendor: { name: 'Blu' } } },
    { name: '6045I', model: 'idol3', brand: { name: 'ALCATEL ONETOUCH IDOL 3', vendor: { name: 'TCT (Alcatel)' } } },
    { name: 'SHV42', model: 'LYV', brand: { name: 'AQUOS R2', vendor: { name: 'Sharp' } } },
    { name: 'SH-03K', model: 'SH-03K', brand: { name: 'AQUOS R2', vendor: { name: 'Sharp' } } },
    { name: '706SH', model: 'SG706SH', brand: { name: 'AQUOS R2', vendor: { name: 'Sharp' } } },
    { name: 'SH-04L', model: 'SH-04L', brand: { name: 'AQUOS R3', vendor: { name: 'Sharp' } } },
    { name: '808SH', model: 'SG808SH', brand: { name: 'AQUOS R3', vendor: { name: 'Sharp' } } },
    { name: 'SHV44', model: 'NAX', brand: { name: 'AQUOS R3', vendor: { name: 'Sharp' } } },
    { name: 'SH-R10A', model: 'SH-R10', brand: { name: 'AQUOS R3', vendor: { name: 'Sharp' } } },
    { name: 'SH-01H', model: 'SH-01H', brand: { name: 'AQUOS ZETA SH-01H', vendor: { name: 'Sharp' } } },
    { name: 'SH-M05', model: 'SH-M05', brand: { name: 'AQUOS sense lite (SH-M05)', vendor: { name: 'Sharp' } } },
    { name: 'ASUS_T00N', model: 'ASUS_T00N', brand: { name: 'ASUS Padphone', vendor: { name: 'asus' } } },
    { name: 'A1-840FHD', model: 'ducati2fhd', brand: { name: 'Acer Iconia Tab 8', vendor: { name: 'Acer' } } },
    { name: 'Advance 4.0M', model: 'Advance_4_0M', brand: { name: 'Advance 4.0M', vendor: { name: 'Blu' } } },
    { name: 'HTC_Amaze_4G', model: 'ruby', brand: { name: 'Amaze 4G', vendor: { name: 'htc' } } },
    { name: 'Amazing X5', model: 'ZTE_T620', brand: { name: 'Amazing X5s', vendor: { name: 'ZTE' } } },
    { name: 'android_unknown', model: 'Android device', brand: { name: 'Android device', vendor: { name: 'android_unknown' } } },
    { name: 'Aquaris X2 Pro', model: 'zangyapro_sprout', brand: { name: 'Aquaris X2 Pro', vendor: { name: 'BQ' } } },
    { name: 'LM-X220', model: 'cv1s', brand: { name: 'Aristo 3/K8s', vendor: { name: 'lge' } } },
    { name: 'LM-X220PM', model: 'mcv1s', brand: { name: 'Aristo 3/K8s/Tribute Empire', vendor: { name: 'lge' } } },
    { name: 'LM-X220QMA', model: 'mcv1s', brand: { name: 'Aristo 3/K8s/Tribute Empire', vendor: { name: 'lge' } } },
    { name: 'HUAWEI G525-U00', model: 'hwG525-U00', brand: { name: 'Ascend', vendor: { name: 'huawei' } } },
    { name: 'G526-L22', model: 'hwG526-L22', brand: { name: 'Ascend G526 4G', vendor: { name: 'huawei' } } },
    { name: 'G740-L00', model: 'hwG740-L00', brand: { name: 'Ascend G740', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI P7-L12', model: 'hwp7', brand: { name: 'Ascend P7', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI P7-L07', model: 'hwp7', brand: { name: 'Ascend P7', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI MT7-CL00', model: 'hwmt7', brand: { name: 'Ascend mate 7', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI MT7-TL00', model: 'hwmt7', brand: { name: 'Ascend mate 7', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI MT7-TL10', model: 'hwmt7', brand: { name: 'Ascend mate 7', vendor: { name: 'huawei' } } },
    { name: 'HUAWEI MT7-L09', model: 'hwmt7', brand: { name: 'Ascend mate 7', vendor: { name: 'huawei' } } },
  ],
}

export const queryIosDeviceModelsMock = {
  deviceModels: [
    { name: 'iPhone12,1', model: 'iPhone 11', brand: { name: 'iPhone 11', vendor: { name: 'apple' } } },
    { name: 'iPhone12,3', model: 'iPhone 11 Pro', brand: { name: 'iPhone 11 Pro', vendor: { name: 'apple' } } },
    { name: 'iPhone13,1', model: 'iPhone 12 mini', brand: { name: 'iPhone 12 mini', vendor: { name: 'apple' } } },
    { name: 'iPhone13,2', model: 'iPhone 12', brand: { name: 'iPhone 12', vendor: { name: 'apple' } } },
    { name: 'iPhone13,3', model: 'iPhone 12 Pro', brand: { name: 'iPhone 12 Pro', vendor: { name: 'apple' } } },
  ],
}

export const queryDeviceModels: ApolloQuery<any, MetadataQueryVariables> = {
  mockQueryFn: args => (args.osFamily == 'android' ? queryAndroidDeviceModelsMock : queryIosDeviceModelsMock),
  query: queryDeviceModelsGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: NoPermissions,
}
