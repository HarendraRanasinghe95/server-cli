/* @flow */
'use strict'

/* ::
import type {
  BlinkMRC,
  BlinkMRCServer,
  ServerCLIServiceConfig
} from '../types.js'
*/

const chalk = require('chalk')
const Table = require('cli-table2')
const objectMerge = require('object-merge')

const projectMeta = require('./utils/project-meta.js')
const values = require('./values.js')

function read (
  cwd /* : string */
) /* : Promise<BlinkMRCServer> */ {
  return projectMeta.read(cwd)
    .then((cfg) => cfg && cfg.server ? cfg.server : {})
}

function display (
  logger /* : typeof console */,
  cwd /* : string */,
  env /* : ?string */
) /* : Promise<void> */ {
  return read(cwd)
    .then((meta) => meta.project ? meta : Promise.reject(new Error()))
    .catch(() => Promise.reject(new Error('Scope has not been set yet, see --help for information on how to set scope.')))
    .then((meta) => {
      var table = new Table()
      table.push(
        [{
          content: chalk.bold('Scope'),
          hAlign: 'center',
          colSpan: 2
        }],
        [
          chalk.grey('Project'),
          meta.project
        ],
        [
          chalk.grey('Region'),
          meta.region
        ],
        [
          chalk.grey('Timeout'),
          meta.timeout || values.DEFAULT_TIMEOUT_SECONDS
        ]
      )
      if (env) {
        table.push([
          chalk.grey('Environment'),
          env
        ])
      }
      logger.log(table.toString())
    })
}

function write (
  cwd /* : string */,
  meta /* : BlinkMRCServer */
) /* : Promise<BlinkMRCServer> */ {
  meta = meta || {}
  if (!meta.project) {
    return Promise.reject(new Error('meta.project was not defined.'))
  }

  return projectMeta.write(cwd, (config) => {
    const service = config && config.server && config.server.service ? config.server.service : {}
    return objectMerge(config, {
      server: {
        project: meta.project,
        region: meta.region,
        service: {
          bucket: service.bucket || values.SERVER_CLI_SERVICE_S3_BUCKET,
          origin: service.origin || values.SERVER_CLI_SERVICE_ORIGIN
        }
      }
    })
  })
    .then((cfg) => cfg.server || {})
}

function serverCLIServiceConfig (
  config /* : BlinkMRCServer */
) /* : ServerCLIServiceConfig */ {
  const serviceCliService = config.service || {}
  return {
    bucket: serviceCliService.bucket || values.SERVER_CLI_SERVICE_S3_BUCKET,
    origin: serviceCliService.origin || values.SERVER_CLI_SERVICE_ORIGIN
  }
}

module.exports = {
  read,
  display,
  write,
  serverCLIServiceConfig
}
