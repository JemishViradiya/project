/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

const i18NameBase = 'deviceMetadata'

export enum DeviceMetadata {
  ACER = 'acer',
  ALL = 'all',
  ANDROID_UNKNOWN = 'android_unknown',
  APPLE = 'apple',
  ASUS = 'asus',
  BLACKBERRY = 'blackberry',
  BLU = 'blu',
  FAIRPHONE = 'fairphone',
  GOOGLE = 'google',
  HP = 'hp',
  HTC = 'htc',
  HUAWEI = 'huawei',
  HYUNDAI = 'hyundai',
  INTERMEC = 'intermec',
  KYOCERA = 'kyocera',
  LENOVO = 'lenovo',
  LG = 'lg',
  LGE = 'lge',
  MEDION = 'medion',
  MICROMAX = 'micromax',
  MOTOROLA = 'motorola',
  NEC = 'nec',
  NOKIA = 'nokia',
  NUBIA = 'nubia',
  ONEPLUS = 'oneplus',
  OPPO = 'oppo',
  PANASONIC = 'panasonic',
  PANTECH = 'pantech',
  PRESTIGIO = 'prestigio',
  RECON = 'recon',
  SAMSUNG = 'samsung',
  SHARP = 'sharp',
  SILENT_CIRCLE = 'silent circle',
  SONIM = 'sonim',
  SONY = 'sony',
  SONYERICSSON = 'sony ericsson',
  SONY_ERICSSON = 'sony_ericsson',
  TCL_COMMUNICATION_LTD = 'tcl communication ltd.',
  TCT_ALCATEL = 'tct =alcatel',
  TESCO = 'tesco',
  TG_CO = 'tg&co.',
  UNKNOWN = 'unknown',
  VERIZON_WIRELESS = 'verizon wireless',
  VUZIX = 'vuzix',
  WIKO = 'wiko',
  WP_UNKNOWN = 'wp_unknown',
  XIAOMI = 'xiaomi',
  XPLORE_TECHNOLOGIES = 'xplore_technologies',
  YU = 'yu',
  ZTE = 'zte',
}

function getEnumKeyByEnumValue(enumValue) {
  const keys = Object.keys(DeviceMetadata).filter(x => DeviceMetadata[x] == enumValue)
  return keys.length > 0 ? keys[0] : null
}

export function getI18VendorName(name) {
  return getEnumKeyByEnumValue(name) ? `${i18NameBase}.hardwareVendor.${getEnumKeyByEnumValue(name)}` : null
}

export function getI18DeviceMetadata(label) {
  return `${i18NameBase}.${label}`
}
