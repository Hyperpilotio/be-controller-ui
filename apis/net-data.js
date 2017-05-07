const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let result = await client.query(`
    SELECT be_bw, hp_bw FROM net
    WHERE time > now() - 30m
    AND hostname = '${node}'
    ORDER BY time DESC
  `)

  ctx.body = _.concat(
    [["time", "be_bw", "hp_bw"]],
    result.map(({ time, be_bw, hp_bw }) => [time, be_bw, hp_bw])
  )
  // for (let row of result) {
  //   for (let column of ctx.body)
  //     column.push(row[column[0]])
  // }

}
