const { newInfluxClient } = require("./util")
const _ = require("lodash")


const SECOND = 1000000000
const PREFIX = "hyperpilot/be_controller_ui/"

const continuousQueries = [
  {
    database: "snap",
    name:     "docker_cpu_usage",
    select:   `derivative(mean(value), 1s) / ${SECOND} * 100 AS perc`,
    from:     "intel/docker/stats/cgroups/cpu_stats/cpu_usage/per_cpu/value",
    where:    `"io.kubernetes.docker.type" != 'podsandbox' AND
               "io.kubernetes.pod.namespace !~ /hyperpilot|kube-system/"`,
    groupBy:  `docker_id, nodename, time(5s)`
  },
  {
    database: "be_controller",
    name:     "be_cpu_quota",
    select:   "mean(be_quota) AS be_quota, last(action) AS action",
    from:     "cpu_quota",
    groupBy:  "hostname, time(5s)"
  },
  {
    database: "be_controller",
    name:     "net_bw_usage",
    select:   `last(hp_bw) AS hp_bw,
               last(be_bw) AS be_bw,
               last(total_bw) AS total_bw`,
    from:     "net",
    groupBy:  "hostname, time(3s)"
  }
]

module.exports = async () => {

  let client = newInfluxClient()

  // Typo in node-influx, it should be showContinuousQueries
  let existingCQs = _.map(await client.showContinousQueries(""), "name")

  let queries = []

  for (let cq of continuousQueries) {
    if (!_.includes(existingCQs, cq.name)) {

      queries.push((async () => {
        await client.query(`
          SELECT ${cq.select} INTO "${PREFIX}${cq.name}" FROM "${cq.from}"
          WHERE time > now() - 5m ${cq.where ? "AND " + cq.where : ""}
          GROUP BY ${cq.groupBy} fill(previous)
        `, { database: cq.database })

        await client.createContinuousQuery(
          cq.name,
          `SELECT ${cq.select} INTO "${PREFIX}${cq.name}" FROM "${cq.from}"
           ${cq.where ? "WHERE " + cq.where : ""}
           GROUP BY ${cq.groupBy} fill(previous)`,
          cq.database
        )
      })())

    }

  }

  await Promise.all(queries)
}
