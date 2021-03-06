/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer,
  CLIFlags,
  CLIOptions
} from '../types.js'
*/

const path = require('path')

const chalk = require('chalk')

const readCors = require('../lib/cors/read.js')
const serve = require('../lib/serve.js')
const displayRoutes = require('../lib/routes/display.js')
const scope = require('../lib/scope.js')

module.exports = async function (
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */
) /* : Promise<void> */ {
  const cfg = await scope.read(flags.cwd)
  const cwd = path.resolve(flags.cwd)
  const cors = await readCors(cwd)
  const server = await serve.startServer(logger, {
    cors,
    cwd,
    env: flags.env,
    port: flags.port || 3000,
    options
  },
  cfg,
  options.blinkMobileIdentity, flags.env)
  await displayRoutes(logger, flags.cwd)
  if (cfg.awsProfile) {
    logger.log(`You are using the following AWS profile: ${cfg.awsProfile}`)
  } else {
    logger.log('No AWS profile has been configured in the .blinkmrc file. A generic role has been assumed.')
  }
  logger.log(`
HTTP service for local development is available from:
  http://localhost:${server.info.port}

${chalk.yellow('Hit CTRL-C to stop the service')}
`)
}
