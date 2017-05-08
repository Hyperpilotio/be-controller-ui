const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT slack, be_shares, hp_shares FROM cpu_quota
    WHERE time > now() - 5m
    AND hostname = '${node}'
    ORDER BY time
  `)

  ctx.body = result.map(d => [d.time, d.slack, d.be_shares, d.hp_shares])

}
