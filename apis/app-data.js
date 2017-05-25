const { newInfluxClient, getTimeCondition } = require("./util")
const _ = require("lodash")

const PREFIX = "hyperpilot/be_controller_ui/"

module.exports = async ctx => {

  const timeCondition = getTimeCondition(ctx.query.after)

  let client = newInfluxClient({ database: "snap" })

  let queries = [
    [`SELECT rps FROM "${PREFIX}qos_throughput" WHERE ${timeCondition}`],

    [`SELECT latency FROM "${PREFIX}qos_latency" WHERE ${timeCondition}`],

    [`SELECT slack FROM "${PREFIX}qos_slack" WHERE ${timeCondition}`,
     { database: "be_controller" }]
  ].map(q => client.query(...q))

  let [throughput, latency, slack] = await Promise.all(queries)
  ctx.body = [
    throughput.map(r => [r.time, r.rps]),
    latency.map(r => [r.time, r.latency]),
    slack.map(r => [r.time, r.slack])
  ]

}
