// Copyright 2021 BlackBerry. All Rights Reserved.
import './setup'

import { initializeApplication } from '@ues-behaviour/app-shell'

import Application from './app/application'
import Launcher from './app/launcher'

initializeApplication(Launcher, Application)
