const { newK8SClient } = require("./util")
const _ = require("lodash")

module.exports = async ctx => {

  const K8S = newK8SClient()
  let res = await K8S.nodes.aget()
  let nodes = res.items.filter(
    node => !_.has(node.metadata.labels, "node-role.kubernetes.io/master")
  ).map( node => ({
    name: node.metadata.name,
    nodeId: node.metadata.labels["hyperpilot/node-id"]
  }) )

  ctx.body = { nodes: _.sortBy(nodes, "nodeId") }
}
