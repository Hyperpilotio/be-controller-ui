const { InfluxDB } = require("influx")
const _ = require("lodash")
const fetch = require("isomorphic-fetch")


if (typeof window === "undefined") {

  module.exports = async ctx => {

    let client = new InfluxDB({
      host: process.env.INFLUXDB_HOST,
      port: parseInt(process.env.INFLUXDB_PORT),
      username: process.env.INFLUXDB_USER,
      password: process.env.INFLUXDB_PASS,
      database: process.env.INFLUXDB_NAME_CONTROLLER
    })

    let rows = await client.query(`
      SELECT value FROM data
      WHERE time > now() - 5m
      GROUP BY controller, hostname
      ORDER BY time DESC
    `)

    ctx.body = _.map(rows.groups(), group => ({
      controller: group.tags.controller,
      hostname: group.tags.hostname,
      rows: _.map(group.rows, row => ({
        time: row.time,
        value: JSON.parse(row.value.replace(/'/g, '"'))
      }))
    }))

  }

} else {

  module.exports = async () => {
    let res = await fetch("/apis/controller-log")
    return await res.json()
  }

}
