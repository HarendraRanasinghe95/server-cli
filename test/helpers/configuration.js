'use strict'

function configurationMock (readFn, writeFn) {
  readFn = readFn || ((cwd) => Promise.resolve({}))
  writeFn = writeFn || ((cwd, updateFn) => Promise.resolve(updateFn({})))
  return {
    read: (cwd) => readFn(cwd),
    write: (config, cwd) => writeFn(config, cwd)
  }
}

module.exports = configurationMock
