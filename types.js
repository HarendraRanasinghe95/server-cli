/* @flow */
'use strict'

/* ::
import type BmResponse from './lib/bm-response.js'
*/

/* ::
export type AWSCredentials = {
  accessKeyId : string,
  secretAccessKey : string,
  sessionToken : string
}

export type BlinkMobileIdentity = {
  assumeAWSRole : () => Promise<AWSCredentials>,
  getServiceSettings : () => Promise<BMServerSettings>,
  getAccessToken : () => Promise<string>
}

export type BlinkMRC = {
  server?: BlinkMRCServer
}

export type BlinkMRCServer = {
  project?: string,
  region?: string,
  cors?: CorsConfiguration | boolean,
  routes?: Array<RouteConfiguration>,
  timeout?: number
}

export type BMServerSettings = {
  bucket : string,
  serviceOrigin : string
}

export type BmRequest = {
  body: any,
  headers: Headers,
  method: string,
  url: {
    host: string,
    hostname: string,
    params: { [id:string]: string },
    pathname: string,
    protocol: Protocol,
    query: { [id:string]: string }
  }
}

export type CLIFlags = {
  deploymentBucket?: string,
  cwd: string,
  env: string,
  executionRole?: string,
  filter?: string,
  force: boolean,
  out?: string,
  port?: string,
  region: string,
  startTime?: string,
  tail: boolean,
  vpcSecurityGroups?: string,
  vpcSubnets?: string
}

export type CLIOptions = {
  blinkMobileIdentity: BlinkMobileIdentity
}

export type CorsConfiguration = {
  credentials: boolean,
  exposedHeaders: Array<string>,
  headers: Array<string>,
  maxAge: number,
  origins: Array<string>
}

export type Handler = (BmRequest, BmResponse) => any

export type HandlerConfiguration = {
  handler: Handler | void,
  params: {
    [id:string]: string
  }
}

export type Headers = {
  [id:string]: string
}

export type LambdaEvent = {
  body: any,
  headers: Headers,
  httpMethod: string,
  path: string,
  pathParameters: { [id:string]: string },
  queryStringParameters: { [id:string]: string },
  resource: string
}

export type MapObject = { [id:string]: any }

export type ProjectConfig = {
  load: () => Promise<BlinkMRC>,
  update: ((BlinkMRC) => BlinkMRC) => Promise<BlinkMRC>
}

export type Protocol = 'http:' | 'https:'

export type RouteConfiguration = {
  route: string,
  module: string,
  timeout: number,
  params?: {[id:string]: string}
}
*/
