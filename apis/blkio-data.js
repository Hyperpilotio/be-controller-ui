const { newInfluxClient, getTimeCondition } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  const { node, after } = ctx.query
  const timeCondition = getTimeCondition(after)

  const client = newInfluxClient()

  const fields = [
    "hp_rd_iops",
    "be_rd_iops",
    "total_riops",

    "hp_wr_iops",
    "be_wr_iops",
    "total_wiops",

    "be_rd_limit",
    "be_wr_limit"
  ]
  const selector = _.join(fields.map(f => `mean(${f}) AS ${f}`), ", ")
  const result = await client.query(`
    SELECT ${selector}
    FROM blkio
    WHERE hostname = '${node}'
    AND ${timeCondition}
    GROUP BY time(2s)
  `)

  ctx.body = result.map(r => [ r.time, ...fields.map(f => r[f]) ])

}
