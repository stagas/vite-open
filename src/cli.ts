#!/usr/bin/env node

import { decarg } from 'decarg'
import { open, Options } from '.'

const options = decarg(new Options())!

open(options)
