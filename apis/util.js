const { InfluxDB } = require("influx")
const _ = require("lodash")

module.exports.newInfluxClient = options => new InfluxDB(
  _.extend({
    host: process.env.INFLUXDB_HOST || "localhost",
    port: parseInt(process.env.INFLUXDB_PORT || 8086),
    username: process.env.INFLUXDB_USER,
    password: process.env.INFLUXDB_PASS,
    database: "be_controller"
  }, options)
)
