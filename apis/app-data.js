const { newInfluxClient, getTimeCondition, getCQ } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  const timeCondition = getTimeCondition(ctx.query.after)

  let client = newInfluxClient({ database: "snap" })

  let queries = [
    [`SELECT rps FROM ${getCQ("qos_throughput")} WHERE ${timeCondition}`],

    [`SELECT latency FROM ${getCQ("qos_latency")} WHERE ${timeCondition}`],

    [`SELECT slack FROM ${getCQ("qos_slack")} WHERE ${timeCondition}`,
     { database: "be_controller" }]
  ].map(q => client.query(...q))

  let [throughput, latency, slack] = await Promise.all(queries)
  ctx.body = [
    throughput.map(r => [r.time, r.rps]),
    latency.map(r => [r.time, r.latency]),
    slack.map(r => [r.time, r.slack])
  ]

}
