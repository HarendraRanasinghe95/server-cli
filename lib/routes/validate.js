/* @flow */
'use strict'

/* ::
import type {RouteConfiguration} from './read.js'
*/

const path = require('path')

const fs = require('@jokeyrhyme/pify-fs')

function validateRoute (
  cwd /* : string */,
  routeConfig /* : RouteConfiguration */
) /* : Promise<Array<string>> */ {
  const errors = []
  // Ensure route property starts with a '/'
  if (!routeConfig.route.startsWith('/')) {
    errors.push('Route must start with a "/"')
  }
  // Ensure module property is a relative path from cwd and exists
  return fs.stat(path.resolve(cwd, routeConfig.module))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        err.message = `Could not find module: ${routeConfig.module}`
      }
      errors.push(err.message || err)
    })
    .then(() => errors)
}

module.exports = validateRoute