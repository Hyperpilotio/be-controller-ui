const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let client = newInfluxClient({ database: "snap" })
  let queries = [
    [`SELECT derivative(last(value), 1s) AS rps
      FROM "hyperpilot/goddd/api_booking_service_request_count"
      WHERE total = 'TOTAL'
      AND time > now() - 5m
      GROUP BY time(3s)`],

    [`SELECT mean(value) * 1000 AS latency
      FROM "hyperpilot/goddd/api_booking_service_request_latency_microseconds"
      WHERE summary = 'quantile_90'
      AND time > now() - 5m
      GROUP BY time(3s)`],

    [`SELECT mean(slack) AS slack FROM cpu_quota
      WHERE time > now() - 5m
      GROUP BY time(3s)`, { database: "be_controller" }]

  ].map(q => client.query(...q))

  let [throughput, latency, slack] = await Promise.all(queries)
  ctx.body = [
    throughput.map(r => [r.time, r.rps]),
    latency.map(r => [r.time, r.latency]),
    slack.map(r => [r.time, r.slack])
  ]

}
