//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { call, select, take } from 'redux-saga/effects'

const takeSelectionGenerator = function* <TResult = unknown>(selector: (state) => TResult) {
  const initialValue = yield select(selector)

  while (true) {
    yield take('*')
    const newValue = yield select(selector)
    if (newValue !== initialValue) {
      return newValue
    }
  }
}

/**
 * Listen for selector's output to change and returns
 * the new value. The effect is blocking.
 */
export const takeSelection = <TResult = unknown>(selector: (state) => TResult) => call(takeSelectionGenerator, selector)
