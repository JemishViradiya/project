/* eslint-disable @typescript-eslint/no-var-requires */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
const rootMain = require('../../../../.storybook/main')

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
}
