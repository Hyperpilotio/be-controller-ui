const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT mean(hp_rd_iops) + mean(hp_wr_iops) AS hp_iops,
           mean(be_rd_iops) + mean(be_wr_iops) AS be_iops,
           mean(total_riops) + mean(total_wiops) AS total_iops,
           mean(be_rd_limit) AS be_rd_limit,
           mean(be_wr_limit) AS be_wr_limit
    FROM blkio
    WHERE hostname = '${node}'
    AND time > now() - 5m
    GROUP BY time(2s)
  `)

  ctx.body = result.map(r => [
    r.time,
    r.hp_iops,
    r.be_iops,
    r.total_iops,
    r.be_rd_limit,
    r.be_wr_limit
  ])

}
