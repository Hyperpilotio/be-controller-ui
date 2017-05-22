import Router from "next/router"
import apis from "../apis/client"
import NetController from "../components/NetController"
import { FetchUpdateManager } from "./AutoUpdateDataContainer"
import _ from "lodash"


export default class NetPanelContainer extends FetchUpdateManager {
  component = NetController

  async fetchLatestUpdate() {

    let query = { node: Router.query.id }
    if (this.dataAlready) query.after = this.getAfterParam()

    let data = await apis.netData(query)
    data = data.map( ([time, ...row]) => [ new Date(time), ...row ] )

    return data
  }
}
