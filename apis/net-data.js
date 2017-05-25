const { newInfluxClient, getTimeCondition, getCQ } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node, after } = ctx.query
  let timeCondition = getTimeCondition(after)

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT hp_bw, be_bw, total_bw
    FROM ${getCQ("net_bw_usage")}
    WHERE ${timeCondition}
    AND hostname = '${node}'
  `)

  ctx.body = result.map(r => [r.time, r.hp_bw, r.be_bw, r.total_bw])

}
