/**
This module exports a "handler" function,
that wraps a customer function.
We bundle this module and its dependencies to ../dist/wrapper.js .
To bundle: `npm run build`
*/
'use strict'

const path = require('path')

const apis = require('../lib/apis.js')

// assume that this file has been copied and renamed as appropriate
function getAPIName () {
  return path.basename(__filename, '.js')
}

function keysToLowerCase (object) {
  return Object.keys(object).reduce((result, key) => {
    result[key.toLowerCase()] = object[key]
    return result
  }, {})
}

function normaliseMethod (method) {
  return method.toLowerCase()
}

/**
https://www.w3.org/TR/url-1/#dom-urlutils-protocol
protocol ends with ':', same as in Node.js 'url' module
https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
*/
function protocolFromHeaders (headers) {
  if (headers['x-forwarded-proto'] === 'https') {
    return `https:`
  }
  if (headers.forwarded && ~headers.forwarded.indexOf('proto=https')) {
    return `https:`
  }
  if (headers['front-end-https'] === 'on') {
    return `https:`
  }
  return 'http:'
}

// return only the pertinent data from a API Gateway + Lambda event
function normaliseLambdaRequest (request) {
  const headers = keysToLowerCase(request.headers)
  return {
    body: request.body,
    headers,
    method: normaliseMethod(request.method),
    url: {
      host: headers.host,
      hostname: headers.host,
      pathname: `/api/${getAPIName()}`,
      protocol: protocolFromHeaders(headers),
      query: request.query
    }
  }
}

function handler (event, context, cb) {
  // TODO: extract error code from Boom-compatible errors
  // TODO: error handling needs to match Serverless' APIG error templates
  const api = apis.getAPI(__dirname, getAPIName())
  if (!api) {
    cb(new Error(500))
    return
  }

  // TODO: transparently implement HEAD

  apis.executeAPI(api, normaliseLambdaRequest(event))
    .then((result) => {
      cb(null, result || 200)
    })
    .catch((err) => cb(err))
}

module.exports = {
  handler,
  keysToLowerCase,
  normaliseMethod,
  normaliseLambdaRequest,
  protocolFromHeaders
}
