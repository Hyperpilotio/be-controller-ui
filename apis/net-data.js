const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT be_bw, hp_bw FROM net
    WHERE time > now() - 5m
    AND hostname = '${node}'
    ORDER BY time
  `)

  ctx.body = result.map(({ time, be_bw, hp_bw }) => [time, be_bw, hp_bw])

}
