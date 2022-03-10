/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

// Return the review site id if exists
export const getReviewSiteId = (): string => {
  if (!window) return ''
  const result = window.location.pathname.match(/^\/uc\/\.stage\/(?<id>[^/]+)/i)
  return result?.groups?.id || ''
}
