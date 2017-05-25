const { InfluxDB } = require("influx")
const KubeApi = require("kubernetes-client")
const ApiGroup = require("kubernetes-client/lib/api-group")
const BaseObject = require("kubernetes-client/lib/base")
const _ = require("lodash")


const aget = function aget(options = {}) {
  return new Promise((resolve, reject) => {
    this.get(options, (error, result) => {
      if (!_.isNull(error))
        reject(error)
      else
        resolve(result)
    })
  })
}


module.exports = {

  newInfluxClient: options => new InfluxDB(
    _.extend({
      host: process.env.INFLUXDB_HOST || "localhost",
      port: parseInt(process.env.INFLUXDB_PORT || 8086),
      username: process.env.INFLUXDB_USER,
      password: process.env.INFLUXDB_PASS,
      database: "be_controller"
    }, options)
  ),

  newK8SClient: () => {
    if (ApiGroup.prototype.aget === undefined)
      ApiGroup.prototype.aget = aget
    if (BaseObject.prototype.aget === undefined)
      BaseObject.prototype.aget = aget
    if (!_.isUndefined(process.env.KUBERNETES_SERVICE_HOST))
      return new KubeApi.Core(KubeApi.config.getInCluster())
    return new KubeApi.Core(KubeApi.config.fromKubeconfig())
  },

  getTimeCondition: after => {
    if (_.isUndefined(after))
      return "time > now() - 5m"
    else
      return `time > ${after * 1000 * 1000}`
  },

  getCQ: name => `"hyperpilot/be_controller_ui/${name}"`

}
