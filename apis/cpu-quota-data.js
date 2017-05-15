const { newInfluxClient } = require("./util")
const _ = require("lodash")

const second = 1000000000 // Nanoseconds

module.exports = async ctx => {

  let { node } = ctx.query

  let client = newInfluxClient()
  let queries = [
    [`SELECT mean(be_quota) as be_quota FROM cpu_quota
      WHERE time > now() - 5m
      AND hostname = '${node}'
      GROUP BY time(5s)`],

    [`SELECT mean(cpu_usage) AS cpu_usage FROM cpu_quota
      WHERE time > now() - 5m
      AND hostname = '${node}'
      GROUP BY time(5s)`],

    [`SELECT derivative(last(value)) / ${5 * second / 100} AS perc
      FROM "intel/docker/stats/cgroups/cpu_stats/cpu_usage/per_cpu/value"
      WHERE "io.kubernetes.pod.namespace" = 'default'
      AND "io.kubernetes.docker.type" = 'container'
      AND nodename = '${node}'
      AND time > now() - 5m
      GROUP BY cpu_id, "io.kubernetes.container.name", time(5s)`,
      { database: "snap" }]
  ].map(q => client.query(...q))

  let [quota, totalCpu, cpuData] = await Promise.all(queries)

  quota = quota.map(r => [r.time, r.be_quota])
  totalCpu = totalCpu.map(r => [r.time, r.cpu_usage])

  let cpuSeriesByCont = _.mapValues(
    // Group the groups, group by app (container) name
    _.groupBy(cpuData.groups(), g => g.tags["io.kubernetes.container.name"]),

    // Calculate average percentage for each time interval
    byCpu => _.zip(..._.map(byCpu, "rows")).map(
      row => [ row[0].time, _.meanBy(row, "perc") ] // [ time, usage ]
    )
  )
  let byWclass = _.mapValues(
    _.extend(
      _.groupBy(
        _.entries(cpuSeriesByCont),
        // Separate BE and HP by name starting with "spark-" or not
        ([app, d]) => _.startsWith(app, "spark-") ? "be": "hp"
      ),
      { "total": [ ["total", totalCpu] ] }
    ),
    // Sum of the usage
    conts => _.zip(..._.map(conts, 1)).map(rows => [
      rows[0][0], // time
      _.sumBy(rows, 1) // usage
    ])
  )
  cpuData = _.zipWith(byWclass.hp, byWclass.be, byWclass.total, (hp, be, total) => [
    // Flatten the data
    _.get(hp, 0) || _.get(be, 0) || _.get(total, 0), // time
    ..._.map([hp, be, total], 1)
  ])

  ctx.body = [quota, cpuData]

}
