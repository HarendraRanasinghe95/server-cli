#!/usr/bin/env node

/* eslint-disable no-console */ // this is a CLI entrypoint

'use strict'

const path = require('path')

const meow = require('meow')
const updateNotifier = require('update-notifier')
const chalk = require('chalk')

const BlinkMobileIdentity = require('@blinkmobile/bm-identity')

const pkg = require('../package.json')

const blinkMobileIdentity = new BlinkMobileIdentity(pkg.name)

updateNotifier({ pkg }).notify()

const help = `
Usage: blinkm server <command>

Where command is one of:

  info, serve, scope, deploy

Local development:

  info                    => displays project information
    --cwd <path>          => optionally set the path to project, defaults to current working directory
  serve                   => start a local development server using local API files
    --port <port>         => sets the port to use for server, defaults to 3000
    --cwd <path>          => optionally set the path to project, defaults to current working directory

Initial settings:

  scope                   => displays the current scope
    <project>             => sets the project id
    --region <region>     => optionally sets the region
    --cwd <path>          => optionally set the path to project, defaults to current working directory

Deploying server side code:

  The deploy command requires a login to BlinkMobile before use.
  For help on the login and logout commands please see:
  https://github.com/blinkmobile/identity-cli#usage

  deploy                  => deploy the project
    --force               => deploy without confirmation
    --env <environment>   => optionally sets the environment to deploy to, defaults to 'dev'
    --cwd <path>          => optionally set the path to project, defaults to current working directory
`

const cli = meow({
  help,
  version: true
}, {
  boolean: [
    'force'
  ],
  default: {
    'cwd': process.cwd(),
    'force': false,
    'env': 'dev',
    'region': 'ap-southeast-2'
  },
  string: [
    'deploymentBucket',
    'cwd',
    'env',
    'executionRole',
    'out',
    'port',
    'region',
    'vpcSecurityGroups',
    'vpcSubnets'
  ]
})

const command = cli.input[0]

if (!command) {
  cli.showHelp(0)
}

let main
try {
  main = require(path.join(__dirname, '..', 'commands', `${command}.js`))
} catch (err) {
  console.error(chalk.red(`
Unknown command: ${command}`))
  cli.showHelp(1)
}

if (typeof main !== 'function') {
  console.error(chalk.red(`
Command not implemented: ${command}`))
  cli.showHelp(1)
}

const input = cli.input.slice(1)
const options = {
  cwd: cli.flags.cwd,
  blinkMobileIdentity
}

Promise.resolve()
  .then(() => main(input, cli.flags, console, options))
  .catch((err) => {
    console.error(`
There was a problem executing '${command}':

${chalk.red(err)}

Please fix the error and try again.
`)
    process.exitCode = 1
  })
