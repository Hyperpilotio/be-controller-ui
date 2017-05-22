import Router from "next/router"
import apis from "../apis/client"
import CpuQuotaController from "../components/CpuQuotaController"
import AutoUpdateDataContainer from "./AutoUpdateDataContainer"


export default class CpuPanelContainer extends AutoUpdateDataContainer {
  component = CpuQuotaController

  async updateData() {
    let data = await apis.cpuQuotaData({ node: Router.query.id })
    data = data.map( row => row.map( ([time, ...row]) => [
      new Date(time),
      ...row.map(i => i === null ? NaN : i)
    ] ))
    return data
  }
}
