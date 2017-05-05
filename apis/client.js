const fetch = require("isomorphic-fetch")
const qs = require("qs")
const _ = require("lodash")
const apis = require("./index").apis

for (let name of apis) {
  module.exports[_.camelCase(name)] = async query => {
    let host = typeof window === "undefined" ? "localhost:3000" : location.host
    let queryString = _.isEmpty(query) ? "" : `?${qs.stringify(query)}`
    let res = await fetch(`http://${host}/apis/${name}${queryString}`)
    return await res.json()
  }
}
