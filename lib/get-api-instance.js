/* @flow */
'use strict'

/* ::
import type {
  API,
  BlinkMRCServer
} from '../types.js'
*/

const request = require('request')

const scope = require('./scope.js')

module.exports = async function getAPIInstance (
  config /* : BlinkMRCServer */,
  accessToken /* : string | void */
) /* : Promise<API> */ {
  const serverCLIServiceConfig = scope.serverCLIServiceConfig(config)
  return new Promise((resolve, reject) => {
    if (!config.project) {
      return reject(new Error('Please run the "scope" command to set the project scope.'))
    }
    request(
      `${serverCLIServiceConfig.origin}/apis/${config.project}`,
      {
        auth: {
          bearer: accessToken
        },
        json: true
      },
      (err, response, body) => {
        if (err) {
          return reject(err)
        }
        if (response.statusCode !== 200) {
          return reject(new Error(body && body.message ? body.message : 'Unknown error, please try again and contact support if the problem persists'))
        }
        return resolve(body)
      })
  })
}
