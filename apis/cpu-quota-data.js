const { newInfluxClient, newK8SClient, getTimeCondition, getCQ } = require("./util")
const _ = require("lodash")

const K8S = newK8SClient()


const getHpBeCpu = async (node, influx, timeCondition) => {
  let podList = await K8S.namespace("default").pods.aget()

  let dockerIds = {"root": "TOTAL"}
  for (let pod of podList.items) {
    if (pod.spec.nodeName === node) {
      let wclass = pod.metadata.labels["hyperpilot.io/wclass"] || "HP"
      for (let cont of pod.status.containerStatuses) {
        let [match, dockerId] = /docker:\/\/([0-9a-f]{12})/.exec(cont.containerID)
        dockerIds[dockerId] = wclass
      }
    }
  }

  let cpuData = await influx.query(`
    SELECT docker_id, perc FROM ${getCQ("docker_cpu_usage")}
    WHERE ${timeCondition}
    AND nodename = '${node}'
    AND docker_id =~ /${_.join(_.concat(..._.keys(dockerIds)), "|")}/
  `, { database: "snap" })

  return _
    .values(_.groupBy(cpuData, "time"))
    .map(seriesAtTime => {
      let byClass = _.groupBy(seriesAtTime, row => dockerIds[row.docker_id])
      let sumByClass = _.mapValues(byClass, ofClass => _.sumBy(ofClass, "perc"))
      return [
        _.get(seriesAtTime, "0.time"),
        sumByClass.HP,
        sumByClass.BE,
        sumByClass.TOTAL
      ]
    })
}

const getQuotaData = async (node, influx, timeCondition) => {
  let data = await influx.query(`
    SELECT be_quota, action
    FROM ${getCQ("be_cpu_quota")}
    WHERE ${timeCondition}
    AND hostname = '${node}'
  `)

  return data.map(r => [
    r.time, r.be_quota,
    ["none", "disable_be", "reset_be",
     "shrink_be", "enable_be", "grow_be"].indexOf(r.action)
  ])
}


module.exports = async ctx => {

  let { node, after } = ctx.query
  let timeCondition = getTimeCondition(after)

  let client = newInfluxClient()

  let [cpuData, quota] = await Promise.all(
    [getHpBeCpu, getQuotaData].map(f => f(node, client, timeCondition))
  )

  ctx.body = [cpuData, quota]

}
