const { newK8SClient } = require("./util")
const _ = require("lodash")

module.exports = async ctx => {

  const K8S = newK8SClient()
  let res = await K8S.nodes.aget()
  let nodes = res.items.filter(
    node => !_.has(node.metadata.labels, "node-role.kubernetes.io/master")
  )

  ctx.body = { nodes: nodes.map(node => node.metadata.name) }
}
