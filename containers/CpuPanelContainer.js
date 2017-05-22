import Router from "next/router"
import apis from "../apis/client"
import CpuQuotaController from "../components/CpuQuotaController"
import { MultiSeriesFetchUpdateManager } from "./AutoUpdateDataContainer"


export default class CpuPanelContainer extends MultiSeriesFetchUpdateManager {
  component = CpuQuotaController

  async fetchLatestUpdate() {
    let query = { node: Router.query.id }
    if (this.dataAlready) query.after = this.getAfterParam()

    let data = await apis.cpuQuotaData(query)
    data = data.map( row => row.map( ([time, ...row]) => [
      new Date(time),
      ...row.map(i => i === null ? NaN : i)
    ] ))
    return data
  }
}
