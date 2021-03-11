const createMySQLClient = require('ai-mysql-client')
const createRedisClient = require('ai-redis-client')
const createQconfClient = require('ai-qconf-client')
const { Qconf } = require('@blued-core/qconf')

const datum = require('../config/datum')
const { isLocalPro } = require('../config/env')

const qconf = new Qconf(datum)
qconf.flag = isLocalPro ? 'production' : ''

const mysqlClient = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  return createMySQLClient({
    key,
    option: qconf,
  })()
}

const redisClient = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  return createRedisClient({
    key,
    option: qconf,
  })()
}

const getQconfHost = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  return createQconfClient.qconfHost({
    key,
    path: datum[key].qconf,
    option: qconf,
  })()
}

const getQconfAllHost = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  return createQconfClient.qconfAllHost({
    key,
    path: datum[key].qconf,
    option: qconf,
  })()
}

const getQconfConf = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  return createQconfClient.qconfConf({
    key,
    path: datum[key].qconf,
    option: qconf,
  })()
}

module.exports = {
  getQconfAllHost,
  getQconfConf,
  getQconfHost,
  mysqlClient,
  redisClient,
}
