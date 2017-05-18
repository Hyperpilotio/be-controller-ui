const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT last(hp_bw) AS hp_bw, last(be_bw) AS be_bw, last(total_bw) AS total_bw
    FROM net
    WHERE time > now() - 5m
    AND hostname = '${node}'
    GROUP BY time(3s)
  `)

  ctx.body = result.map(r => [r.time, r.hp_bw, r.be_bw, r.total_bw])

}
