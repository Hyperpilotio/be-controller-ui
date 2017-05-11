const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let client = newInfluxClient({ database: "snap" })
  let queries = [
    `SELECT derivative(last(value), 1s) AS rps
     FROM "hyperpilot/goddd/api_booking_service_request_count"
     WHERE total = 'TOTAL'
     AND time > now() - 5m
     GROUP BY time(3s)`,

    `SELECT mean(value) AS latency
     FROM "hyperpilot/goddd/api_booking_service_request_latency_microseconds"
     WHERE summary = 'quantile_90'
     AND time > now() - 5m
     GROUP BY time(3s)`
  ].map(client.query.bind(client))

  let [throughput, latency] = await Promise.all(queries)
  ctx.body = [
    throughput.map(r => [r.time, r.rps]),
    latency.map(r => [r.time, r.latency])
  ]

}
