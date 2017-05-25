const fetch = require("isomorphic-fetch")
const qs = require("qs")
const _ = require("lodash")
const apis = require("./index").apis

class APIError extends Error {
  constructor(message) {
    super()
    this.name = "APIError"
    this.message = message
    this.stack = new Error().stack
  }
}

for (let name of apis) {
  module.exports[_.camelCase(name)] = async query => {
    let host = typeof window === "undefined" ? "localhost:3000" : location.host
    let queryString = _.isEmpty(query) ? "" : `?${qs.stringify(query)}`
    let path = `/apis/${name}${queryString}`
    let res = await fetch(`http://${host}${path}`)
    let data = await res.json()
    if (!res.ok)
      throw new APIError(`Error while fetching ${path}: ${data.error}`)
    else
      return data
  }
}
