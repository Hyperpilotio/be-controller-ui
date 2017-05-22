const { newInfluxClient, getTimeCondition } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node, after } = ctx.query
  let timeCondition = getTimeCondition(after)

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT last(hp_bw) AS hp_bw, last(be_bw) AS be_bw, last(total_bw) AS total_bw
    FROM net
    WHERE ${timeCondition}
    AND hostname = '${node}'
    GROUP BY time(3s)
  `)

  ctx.body = result.map(r => [r.time, r.hp_bw, r.be_bw, r.total_bw])

}
