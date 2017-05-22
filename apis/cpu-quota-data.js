const { newInfluxClient, newK8SClient } = require("./util")
const _ = require("lodash")

const second = 1000000000 // Nanoseconds
const K8S = newK8SClient()

const getHpBeCpu = async (node, influx) => {
  let podList = await K8S.namespace("default").pods.aget()

  let dockerIds = { BE: [], HP: [], TOTAL: ["root"] }
  for (let pod of podList.items) {
    if (pod.spec.nodeName === node) {
      let wclass = pod.metadata.labels["hyperpilot.io/wclass"] || "HP"
      for (let cont of pod.status.containerStatuses) {
        let [match, dockerId] = /docker:\/\/([0-9a-f]{12})/.exec(cont.containerID)
        dockerIds[wclass].push(dockerId)
      }
    }
  }

  let cpuData = await influx.query(`
    SELECT derivative(last(value), 1s) / ${second / 100} AS perc
    FROM "intel/docker/stats/cgroups/cpu_stats/cpu_usage/per_cpu/value"
    WHERE docker_id =~ /${_.join(_.concat(..._.values(dockerIds)), "|")}/
    AND nodename = '${node}'
    AND time > now() - 5m
    GROUP BY cpu_id, docker_id, time(5s) fill(previous)
  `, { database: "snap" })

  let cpuSeriesByCont = _.mapValues(
    // Group the groups, group by app (container) name
    _.groupBy(cpuData.groups(), "tags.docker_id"),

    // Calculate average percentage for each time interval
    byCpu => _.zip(..._.map(byCpu, "rows")).map(
      row => [ row[0].time, _.meanBy(row, "perc") ] // [ time, usage ]
    )
  )

  const [TIME, PERC] = [0, 1]

  let seriesByClass = _.mapValues(dockerIds, ids => {
    let cpuSeriesOfClass = _.map(ids, id => cpuSeriesByCont[id])
    return _.zip(...cpuSeriesOfClass)
            .map( rows => [ rows[0][TIME], _.sumBy(rows, PERC) ] )
  })

  return _.zipWith(
    seriesByClass.HP, seriesByClass.BE, seriesByClass.TOTAL,
    (...series) => [series[0][TIME], ..._.map(series, PERC)]
  )
}

const getQuotaData = async (node, influx) => {
  let data = await influx.query(`
    SELECT mean(be_quota) AS be_quota,
           last(action) AS action
    FROM cpu_quota
    WHERE time > now() - 5m
    AND hostname = '${node}'
    GROUP BY time(5s)
  `)

  return data.map(r => [
    r.time, r.be_quota,
    ["none", "disable_be", "reset_be",
     "shrink_be", "enable_be", "grow_be"].indexOf(r.action)
  ])
}


module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()

  let [quota, cpuData] = await Promise.all(
    [getQuotaData, getHpBeCpu].map(f => f(node, client))
  )

  ctx.body = [quota, cpuData]

}
