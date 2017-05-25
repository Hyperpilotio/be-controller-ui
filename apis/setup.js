const { newInfluxClient, getCQ } = require("./util")
const _ = require("lodash")


const SECOND = 1000000000

const continuousQueries = [
  {
    database: "snap",
    name:     "qos_throughput",
    select:   `derivative(mean(value), 1s) AS rps`,
    from:     "hyperpilot/goddd/api_booking_service_request_count",
    where:    `total = 'TOTAL'`,
    groupBy:  `time(5s)`
  },
  {
    database: "snap",
    name:     "qos_latency",
    select:   `mean(value) * 1000 AS latency`,
    from:     "hyperpilot/goddd/api_booking_service_request_latency_microseconds",
    where:    `summary = 'quantile_90'`,
    groupBy:  `time(3s)`
  },
  {
    database: "be_controller",
    name:     "qos_slack",
    select:   `mean(slack) AS slack`,
    from:     "cpu_quota",
    groupBy:  `time(3s)`
  },
  {
    database: "snap",
    name:     "docker_cpu_usage",
    select:   `derivative(mean(value), 1s) / ${SECOND} * 100 AS perc`,
    from:     "intel/docker/stats/cgroups/cpu_stats/cpu_usage/per_cpu/value",
    where:    `"io.kubernetes.docker.type" != 'podsandbox' AND
               "io.kubernetes.pod.namespace" !~ /hyperpilot|kube-system/`,
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
    select:   `mean(hp_bw) AS hp_bw,
               mean(be_bw) AS be_bw,
               mean(total_bw) AS total_bw`,
    from:     "net",
    groupBy:  "hostname, time(3s)"
  },
  {
    database: "be_controller",
    name:     "blkio_stats",
    select:   ["hp_rd_iops", "be_rd_iops", "total_riops",
               "hp_wr_iops", "be_wr_iops", "total_wiops",
               "be_rd_limit", "be_wr_limit"]
               .map(f => `mean(${f}) AS ${f}`)
               .join(", "),
    from:     "blkio",
    groupBy:  "hostname, time(2s)"
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
          SELECT ${cq.select} INTO ${getCQ(cq.name)} FROM "${cq.from}"
          WHERE time > now() - 5m ${cq.where ? "AND " + cq.where : ""}
          GROUP BY ${cq.groupBy} fill(previous)
        `, { database: cq.database })

        await client.createContinuousQuery(
          cq.name,
          `SELECT ${cq.select} INTO ${getCQ(cq.name)} FROM "${cq.from}"
           ${cq.where ? "WHERE " + cq.where : ""}
           GROUP BY ${cq.groupBy} fill(previous)`,
          cq.database
        )
      })())

    }

  }

  await Promise.all(queries)
}
