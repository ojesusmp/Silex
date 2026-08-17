#!/usr/bin/env node
'use strict';
require('../lib/silex').main(process.argv.slice(2)).catch(e=>{console.error(`silex: ${e.message}`);process.exitCode=1});
