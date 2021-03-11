const fetch = require('node-fetch')
const crypto = require('crypto')
const logger = require('./logger')
const { getQconfHost } = require('./connect')

async function request({
  url,
  data,
  headers = {},
  method = 'get',
  qconf,
  reject,
  resolve,
}) {
  let request = ''

  if (/^http/ig.test(url)) {
    request = url
  } else {
    const protocol = getQconfHost(qconf)
    request = `http://${protocol.host}:${protocol.port}${url}`
  }

  const option = {
    method,
    headers: Object.assign({
      'Content-Type': 'application/json',
      'X-Request-ID': crypto.randomBytes(16).toString('hex'),
    }, headers),
  }

  if (method.toLocaleLowerCase() === 'post') {
    option.body = JSON.stringify(data || {})
  }

  const result = await fetch(request, option)
    .then(res => res.json())
    .then(res => {
      logger.info({ url: request, option, result: res })

      if (typeof resolve === 'function') {
        return resolve(res)
      }
    })
    .catch(error => {
      logger.error(error, { url: request, option })

      if (typeof reject === 'function') {
        reject(error)
      }
    })

  return result
}

module.exports = request