/* eslint-disable import/first */
/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.global = window

__webpack_public_path__ = document.getElementById('base-deployments').getAttribute('href')

import 'core-js/stable'
import 'regenerator-runtime/runtime'
