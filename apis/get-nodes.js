const { newInfluxClient } = require("./util")
const _ = require("lodash")

module.exports = async ctx => {

  let client = newInfluxClient()
  let settings = await client.query(`
    SELECT * FROM settings GROUP BY hostname LIMIT 1
  `)

  ctx.body = settings.groups().map(node => {

    let nodeSettings = node.rows[0]
    let controllers = {}

    _.entries(nodeSettings).map(([key, val]) => {
      // Unflatten the settings
      let matcher = key.match(/(\S+)_controller\.(\S+)/)
      if (matcher !== null) {
        _.set(controllers, matcher.slice(1), val)
        _.unset(nodeSettings, key)
      }
      if (_.includes(settings.groupsTagsKeys, key))
        _.unset(nodeSettings, key)
    })

    // Make the controllers field an array of objects
    nodeSettings.controllers =
      _.entries(controllers).map(([name, settings]) => ({name, settings}))

    return { node: node.tags.hostname, settings: nodeSettings }
  })
}
