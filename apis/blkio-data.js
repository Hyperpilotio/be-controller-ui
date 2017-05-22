const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()

  let fields = [
    "hp_rd_iops",
    "be_rd_iops",
    "total_riops",

    "hp_wr_iops",
    "be_wr_iops",
    "total_wiops",

    "be_rd_limit",
    "be_wr_limit"
  ]
  let selector = _.join(fields.map(f => `mean(${f}) AS ${f}`), ", ")
  let result = await client.query(`
    SELECT ${selector}
    FROM blkio
    WHERE hostname = '${node}'
    AND time > now() - 5m
    GROUP BY time(2s)
  `)

  ctx.body = result.map(r => [ r.time, ...fields.map(f => r[f]) ])

}
