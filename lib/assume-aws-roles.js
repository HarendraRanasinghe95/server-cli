/* @flow */
'use strict'

/* ::
import type BlinkMobileIdentity, {
  AWSCredentials
} from '@blinkmobile/bm-identity'

import type {
  BlinkMRCServer
} from '../types.js'
*/

const request = require('request')

const scope = require('./scope.js')

function assumeAWSRole (
  role /* : string */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */
) /* : Promise<AWSCredentials> */ {
  const serverCLIServiceConfig = scope.serverCLIServiceConfig(config)
  return new Promise((resolve, reject) => {
    request(
      `${serverCLIServiceConfig.origin}/v1/service-instances/${config.project || ''}/environments/${env}/aws-roles/${role}`,
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
    .then((body) => ({
      accessKeyId: body.Credentials.AccessKeyId,
      secretAccessKey: body.Credentials.SecretAccessKey,
      sessionToken: body.Credentials.SessionToken
    }))
}

function assumeAWSRoleToDeploy (
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */
) /* : Promise<AWSCredentials> */ {
  return assumeAWSRole('deploy', config, env, accessToken)
}

function assumeAWSRoleToViewLogs (
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */
) /* : Promise<AWSCredentials> */ {
  return assumeAWSRole('logs', config, env, accessToken)
}

module.exports = {
  assumeAWSRoleToDeploy,
  assumeAWSRoleToViewLogs
}