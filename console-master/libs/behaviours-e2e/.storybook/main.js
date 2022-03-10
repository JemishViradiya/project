/* eslint-disable @typescript-eslint/no-var-requires */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

const rootMain = require('../../../.storybook/main')

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: ['./../src/storybook/**/*.stories.@(ts|tsx|js|jsx)', './../../behaviour/*/src/**/*.stories.@(ts|tsx|js|jsx)'],
}

for (const addon of module.exports.addons) {
  if (addon.name === '@storybook/addon-essentials') Object.assign(addon.options, { viewport: true })
}
