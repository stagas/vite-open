#!/usr/bin/env node

import { decarg } from 'decarg'
import { Options, open } from '.'

const options = decarg(new Options())!

open(options)
