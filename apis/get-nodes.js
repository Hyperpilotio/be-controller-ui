const { newInfluxClient } = require("./util")
const _ = require("lodash")

module.exports = async ctx => {

  let client = newInfluxClient()
  let res = await client.query(`
    SHOW TAG VALUES FROM cpu_quota WITH KEY = "hostname"
  `)

  ctx.body = { nodes: res.map(({value}) => value) }
}
