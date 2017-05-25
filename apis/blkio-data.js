const { newInfluxClient, getTimeCondition } = require("./util")
const _ = require("lodash")

const PREFIX = "hyperpilot/be_controller_ui/"

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
  const result = await client.query(`
    SELECT ${fields.join(", ")} FROM "${PREFIX}blkio_stats"
    WHERE hostname = '${node}' AND ${timeCondition}
  `)

  ctx.body = result.map(r => [ r.time, ...fields.map( _.propertyOf(r) ) ])

}
