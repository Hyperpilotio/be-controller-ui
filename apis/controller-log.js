const { newInfluxClient } = require("./util")
const _ = require("lodash")
const fetch = require("isomorphic-fetch")


module.exports = async ctx => {

  let client = newInfluxClient()
  let rows = await client.query(`
    SELECT * FROM /(cpu_quota)|(net)/
    WHERE time > now() - 5m
    GROUP BY hostname
    ORDER BY time DESC
  `)

  let byHostname = _.groupBy(rows.groups(), "tags.hostname")
  ctx.body = _.map(byHostname, (controllers, hostname) => ({
    hostname,
    controllers: controllers.map(group => ({
      controller: group.name,
      logs: group.rows.map( row => _.pickBy(row, v => !_.isNull(v)) )
    }))
  }))

}
