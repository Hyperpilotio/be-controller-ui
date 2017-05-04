const { newInfluxClient } = require("./util")
const _ = require("lodash")


module.exports = async ctx => {
  let { node } = ctx.request.query

  let client = newInfluxClient()
  let res = await client.query(`
    SELECT * FROM settings
    WHERE hostname = '${node}'
    ORDER BY time DESC
    LIMIT 1
  `)

  if (res.length === 0) {
    ctx.status = 404
    ctx.body = { error: "Node not found" }
    return
  }

  let settings = res[0]
  let controllers = {}

  _.entries(settings).map(([key, val]) => {
    // Unflatten the settings
    let matcher = key.match(/(\S+)_controller\.(\S+)/)
    if (matcher !== null) {
      _.set(controllers, matcher.slice(1), val)
      _.unset(settings, key)
    }
    if (_.includes(settings.groupsTagsKeys, key))
      _.unset(settings, key)
  })

  // XXX Replace "quota" with "cpu_quota" since "cpu_quota" is the correct name
  controllers.cpu_quota = controllers.quota
  delete controllers.quota

  // Make the controllers field an array of objects
  settings.controllers =
    _.entries(controllers).map(([name, settings]) => ({name, settings}))

  ctx.body = { node, settings }
}
