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
  stories: ['./../docs/**/*.stories.@(ts|tsx|js|jsx)'],
  core: { ...rootMain.core, builder: 'webpack5' },
}

for (const addon of module.exports.addons) {
  if (addon.name === '@storybook/addon-essentials') Object.assign(addon.options, { docs: false, controls: false })
}
module.exports.addons.unshift('@storybook/addon-design-assets/register')
