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

} else {

  module.exports = async () => {
    let res = await fetch("/apis/controller-log")
    return await res.json()
  }

}
