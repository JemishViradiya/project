//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { TimeIntervalId } from '@ues-behaviour/dashboard'

export const EVENTS_QUERY_MAX_RECORDS = 50

// Default 30 days interval unless we are told otherwise via the queryVariables.
// Right now data retention is only 30 days so by getting the max amount of data we ensure
// irrespective of ASC or DESC sort order we have the right set of events.
export const EVENTS_DEFAULT_TIME_INTERVAL = TimeIntervalId.Last30Days
