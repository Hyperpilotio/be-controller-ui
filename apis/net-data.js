const { newInfluxClient, getTimeCondition, getCQ } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node, after } = ctx.query
  let timeCondition = getTimeCondition(after)

  let client = newInfluxClient()

  const fields = [
    "hp_egress_bw",
    "be_egress_bw",
    "total_egress_bw",
    "be_egress_limit",

    "hp_ingress_bw",
    "be_ingress_bw",
    "total_ingress_bw",
    "be_ingress_limit"
  ]
  const result = await client.query(`
    SELECT ${fields.join(", ")} FROM ${getCQ("net_bw_usage")}
    WHERE hostname = '${node}' AND ${timeCondition}
  `)

  ctx.body = result.map(r => [ r.time, ...fields.map( _.propertyOf(r) ) ])

}
